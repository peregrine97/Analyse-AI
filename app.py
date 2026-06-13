import os

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
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Universal Data Agent",version="1.0")

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
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

db = DatabaseManager()
logger = QueryLogger()

app_state = {
    "tables": {},
    "schema": ""
}

@app.get("/")
def get_data():
    return{"message":"Universal Data agent API"}

@app.post("/upload")
async def upload(file:UploadFile=File(...)):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path,"wb") as f:
        f.write(await file.read())

    df = FileLoader.load(file_path=file_path)

    table_name = SchemaManager.get_table_name(file.filename)

    db.save_dataframe(df=df,table_name=table_name)

    app_state["tables"][table_name]=df

    return {
    "message": "uploaded",
    "table_name": table_name,
    "rows": len(df),
    "columns": list(df.columns)
    }

@app.post("/build-schema")
def build_schema():
    if not app_state["tables"]:
        return {
            "error": "No tables uploaded"
        }

    schema = SchemaService.build_schema(app_state['tables'])
    relationships = SchemaService.find_relations(app_state['tables'])

    schema += "\n\nRelationships:\n"

    schema += "\n".join(
        relationships
    )

    app_state['schema']=schema

    print("=" * 50)
    print(len(app_state["schema"]))
    print("=" * 50)

    return {
        "message":"Schema built!!",
        "tables": len(
            app_state["tables"]
            ),
        "relationships": len(
            relationships
        )
    }

@app.get("/tables")
def get_tables():
    return {"tables":list(app_state["tables"].keys())}

query_service = QueryService(
    sql_chain=sql_chain,
    db=db,
    model=model
)

@app.get("/preview/{table_name}")
def get_table(table_name:str):
    df = app_state["tables"][table_name]
    return {
        "data":df.head(5).fillna("").to_dict(orient="records")
    }

@app.post("/query")
def query(request:QueryRequest): ##pydantic checker

    try:
        if not app_state['schema']:
            return{"error":"build schema first!"}
        
        sql_query = query_service.generate_sql(schema=app_state['schema'],question=request.question)

        cleaned_sql_query = query_service.clean_sql(sql_query)

        query_service.validate_sql(cleaned_sql_query)

        sql_query_result = query_service.run_query(cleaned_sql_query)

        logger.log(
            request.question,
            cleaned_sql_query,
            str(sql_query_result),
            True
        )

        final_result = query_service.generate_answer(
    question=request.question,
    result=sql_query_result[:20]
)
        return {
        "question": request.question,
        "sql": cleaned_sql_query,
        "result": str(sql_query_result),
        "answer": final_result
        }
    
    except Exception as e:
        logger.log(
        request.question,
        cleaned_sql_query if "cleaned_sql_query" in locals() else "",
        str(e),
        False
    )

        return{
            "error":str(e)
        }
    
@app.get("/history")
def history():

    return {
        "history":
        logger.get_history()
    }

@app.get("/debug")
def debug():

    result = {}

    for table_name, df in app_state["tables"].items():
        result[table_name] = list(df.columns)

    return result