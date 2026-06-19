import os
import pandas as pd

from fastapi import Depends

from fastapi import FastAPI,UploadFile,File
from models.request_models import QueryRequest
from loaders.file_loader import FileLoader
from database.schema_manager import SchemaManager
from database.db_manager import DatabaseManager
from services.schema_service import SchemaService 
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from services.query_service import QueryService
from database.query_logger import QueryLogger
from services.chart_service import ChartService
from services.workspace_service import WorkspaceService
from services.schema_storage import SchemaStorage
from auth.dependencies import get_current_user
from auth.routes import router as auth_router
from dotenv import load_dotenv
import json

from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(title="Universal Data Agent",version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(
    auth_router
)
##model
model = ChatGroq(
    model="llama-3.3-70b-versatile"
)

#prompt
prompt = PromptTemplate(
    template = """You are a highly skilled SQL expert. Your task is to generate a single, syntactically correct SQLite query based on the provided schema and user question.

### DATABASE SCHEMA
{schema}

### GUIDELINES
1. RESPONSE FORMAT: Return ONLY the SQL code. Do not include markdown code blocks, explanations, or conversational filler.
2. DIALECT: SQLite.
3. LOGIC: 
   - If the request requires filtering, use exact column names from the schema.
   - Use JOINs only when necessary, favoring INNER JOIN unless otherwise specified.
   - If the request involves ambiguity, assume the most common business interpretation.
   - For aggregate functions, use appropriate grouping.
4. VALIDATION: Ensure the query matches the schema exactly. Do not invent columns or tables.
5. RELATIONSHIPS:
   - Use the provided relationships as JOIN keys.
   - For questions involving spending, revenue, sales,
     or monetary calculations, use price-related columns
     when available.
   - Use all necessary tables to answer the question completely.

### QUESTION
{question}

### SQL""",
    input_variables=['schema','question']
    )
sql_chain = prompt | model

@app.get("/")
def get_data():
    return{"message":"Universal Data agent API"}

@app.post("/upload")
async def upload(files:list[UploadFile]=File(...),current_user=Depends(get_current_user)):

    # print("step 1")
    uploaded_files=[]

    for file in files:

        upload_dir = WorkspaceService.get_upload_dir(
            current_user["id"]
        )

        file_path = os.path.join(
            upload_dir,
            file.filename
        )

        # print("step 2")

        with open(file_path,"wb") as f:
            f.write(await file.read())

        # print("step 3")

        df = FileLoader.load(file_path=file_path)

        # print("step 4")

        table_name = SchemaManager.get_table_name(file.filename)

        # print("step 5")

        user_db = DatabaseManager(
            WorkspaceService.get_db_path(
                current_user["id"]
            )
        )

        user_db.save_dataframe(
            df=df,
            table_name=table_name
        )
        # print("step 6")

        uploaded_files.append(table_name)

    return {
    "message": "uploaded",
    "tables": uploaded_files,
    }

@app.post("/build-schema")
def build_schema(current_user=Depends(get_current_user)):
    db = DatabaseManager(
    WorkspaceService.get_db_path(
        current_user["id"]
    )
)

    table_names = db.get_table_names()

    if not table_names:
        return {
            "error": "No tables uploaded"
        }

    all_tables = {}

    for table_name in table_names:

        cols = db.get_table_columns(
            table_name
        )

        all_tables[table_name] = pd.DataFrame(
            columns=cols
        )

    schema = SchemaService.build_schema(
    all_tables
    )

    relationships = SchemaService.find_relations(
    all_tables
    )

    schema += "\n\nRelationships:\n"

    schema += "\n".join(
        relationships
    )

    SchemaStorage.save_schema(
    current_user["id"],
    schema
    )

    

    return {
        "message":"Schema built!!",
        "tables": len(
            all_tables
            ),
        "relationships": len(
            relationships
        )
    }

@app.get("/tables")
def get_tables(
    current_user=Depends(get_current_user)
):

    db = DatabaseManager(
        WorkspaceService.get_db_path(
            current_user["id"]
        )
    )

    return {
        "tables": db.get_table_names()
    }


@app.get("/preview/{table_name}")
def get_table(
    table_name:str,
    current_user=Depends(
        get_current_user
    )
):

    db = DatabaseManager(
        WorkspaceService.get_db_path(
            current_user["id"]
        )
    )

    df = db.preview_table(
        table_name
    )

    return {
        "data":
        df.fillna("")
        .to_dict(
            orient="records"
        )
    }

@app.post("/query")
def query(request:QueryRequest,current_user=Depends(get_current_user)): ##pydantic checker

    try:
        schema = SchemaStorage.load_schema(
            current_user["id"]
        )

        if not schema:
            return {
                "error": "build schema first!"
            }
        
        user_db = DatabaseManager(
            WorkspaceService.get_db_path(
                current_user["id"]
            )
        )

        query_service= QueryService(
            sql_chain=sql_chain,
            db=user_db,
            model=model
        )
        
        sql_query = query_service.generate_sql(schema=schema,question=request.question)

        cleaned_sql_query = query_service.clean_sql(sql_query)

        query_service.validate_sql(cleaned_sql_query)

        sql_query_result = query_service.run_query(cleaned_sql_query)

        result_df = pd.DataFrame(
            sql_query_result["rows"],
            columns=sql_query_result["columns"]
        )

        chart_info = ChartService.suggest_chart(
            result_df
        )
        

        final_result = query_service.generate_answer(
    question=request.question,
    result=sql_query_result["rows"][:20]
)
        history_payload = {
            "question": request.question,
            "sql": cleaned_sql_query,
            "result": sql_query_result,
            "answer": final_result,
            "chart": chart_info
        }

        logger = QueryLogger(
            WorkspaceService.get_db_path(
                current_user["id"]
            )
        )

        logger.log(
            request.question,
            cleaned_sql_query,
            json.dumps(history_payload),
            True
        )
        
        return {
        "question": request.question,
        "sql": cleaned_sql_query,
        "result": (sql_query_result),
        "answer": final_result,
        "chart":chart_info
        }
    
    except Exception as e:

        try:
            logger = QueryLogger(
                WorkspaceService.get_db_path(
                    current_user["id"]
                )
            )

            logger.log(
                request.question,
                cleaned_sql_query if "cleaned_sql_query" in locals() else "",
                str(e),
                False
            )

        except:
            pass

        return {
            "error": str(e)
        }
    
@app.get("/history")
def history(
    current_user=Depends(get_current_user)
):

    db_path = WorkspaceService.get_db_path(
        current_user["id"]
    )

    print("USER:", current_user)
    print("DB PATH:", db_path)

    logger = QueryLogger(db_path)

    return {
        "history": logger.get_history()
    }
    
@app.get("/history/{history_id}")
def get_history_item(history_id: int,current_user=Depends(get_current_user)):

    logger = QueryLogger(WorkspaceService.get_db_path(current_user["id"]))

    history = logger.get_history()

    for item in history:

        if item["id"] == history_id:
            return item["result"]

    return {
        "error": "History item not found"
    }
    
@app.get("/dataset-insights")
def dataset_insights(current_user=Depends(get_current_user)):
    schema = SchemaStorage.load_schema(
    current_user["id"]
    )
    if not schema:
        return {
            "error":"No schema found!"
        }
    prompt = f"""
    You are a senior data analyst.

            Given the schema:

            {schema}
            Return ONLY valid JSON in the following format:

            {{
                "domain": "",
                "entities": [],
                "analysis_areas": [],
                "questions": [],
                "summary": ""
            }}

            Do not include markdown.
            Do not include explanations outside JSON.

        """
    response = model.invoke(prompt)

    try:

        insights = json.loads(
            response.content
        )

        return insights

    except Exception:

        return {
            "error": "Failed to parse insights",
            "raw": response.content
        }
    
@app.get("/dataset-overview")
def dataset_overview(
    current_user=Depends(
        get_current_user
    )
):

    db = DatabaseManager(
        WorkspaceService.get_db_path(
            current_user["id"]
        )
    )

    table_names = db.get_table_names()

    if not table_names:
        return {
            "error": "No tables uploaded"
        }

    total_rows = 0
    total_columns = 0

    largest_table = ""
    largest_rows = 0

    all_tables = {}

    for table_name in table_names:

        cols = db.get_table_columns(
            table_name
        )

        row_count = db.get_table_row_count(
            table_name
        )

        total_rows += row_count
        total_columns += len(cols)

        if row_count > largest_rows:

            largest_rows = row_count
            largest_table = table_name

        all_tables[table_name] = pd.DataFrame(
            columns=cols
        )

    relationships = SchemaService.find_relations(
        all_tables
    )

    return {

        "tables": len(table_names),

        "rows": total_rows,

        "columns": total_columns,

        "relationships": len(
            relationships
        ),

        "largest_table": largest_table,

        "largest_rows": largest_rows
    }

@app.get("/debug-tables")
def debug_tables(
    current_user=Depends(get_current_user)
):

    db = DatabaseManager(
        WorkspaceService.get_db_path(
            current_user["id"]
        )
    )

    return {
        "tables": db.get_table_names()
    }

@app.delete("/clear-workspace")
def clear_workspace(
    current_user=Depends(get_current_user)
):

    WorkspaceService.clear_workspace(
        current_user["id"]
    )

    return {
        "message": "Workspace cleared successfully"
    }