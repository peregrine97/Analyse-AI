from loaders.file_loader import FileLoader
from profiling.profiler import Profiler
from database.db_manager import DatabaseManager
from database.schema_manager import SchemaManager
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
from database.query_logger import QueryLogger

load_dotenv()

all_tables = {}

while True:
    file_path = input("Enter the file path (or 'done'): ")
    if file_path.lower()=="done":
        break

    df = FileLoader.load(file_path)

    table_name = SchemaManager.get_table_name(file_path)
    all_tables[table_name]=df
    print(f"Loaded table : {table_name}")

db =DatabaseManager()

logger = QueryLogger()

for table_name,df in all_tables.items():
    db.save_dataframe(df,table_name)
    print(f"Stored table : {table_name}")

all_schemas = []

for table_name, df in all_tables.items():

    column_info = "\n".join(
        [
            f"{col}: {df[col].dtype}"
            for col in df.columns
        ]
    )

    table_schema = f"""
Table: {table_name}

Rows: {len(df)}

Columns:
{column_info}

Sample Rows:
{df.head(5).to_string(index=False)}
"""

    all_schemas.append(
        table_schema
    )

schema = "\n\n".join(
    all_schemas
)

relationships =[]

for table1,df1 in all_tables.items():

    for table2,df2 in all_tables.items():

        if(table1>=table2):
            continue

        common_columns  = set(df1.columns) & set(df2.columns)

        for col in common_columns:
            relationships.append(f"{table1}.{col} ↔ {table2}.{col}")


schema += "\n\nRelationships:\n"

schema += "\n".join(
    relationships
)

print("\n========== FINAL SCHEMA ==========\n")
print(schema)


model2 = ChatGroq(
    model="llama-3.3-70b-versatile"
)

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
sql_chain = prompt | model2

FORBIDDEN = ["DROP","DELETE","ALTER","TRUNCATE","UPDATE"]

from services.query_service import QueryService

query_service = QueryService(sql_chain,model2,db)

while True:
    question = input("\nType your question here: ")

    if question.lower()=="exit":
        break

    try:
        sql_query = query_service.generate_sql(schema,question)
        sql_query = query_service.clean_sql(sql_query)
        query_service.validate_sql(sql_query)
        print(sql_query)
        sql_ans = query_service.run_query(sql_query)
        print(f"\n{sql_ans}")
        logger.log(question,sql_query,sql_ans,True)
        results = query_service.generate_answer(question,sql_ans)
        print(f"Answer : {results}")

    except Exception as e:
        logger.log(
        question,
        sql_query if "sql_query" in locals() else "",
        str(e),
        False
        )

        print(f"\nError : {e}")
