import re

class QueryService:
    def __init__(self,sql_chain,db,model):
        self.sql_chain = sql_chain
        self.model = model
        self.db = db

        self.FORBIDDEN = [
            "DROP",
            "DELETE",
            "ALTER",
            "TRUNCATE",
            "UPDATE"
        ]

    def generate_sql(self,schema,question):
        
        return self.sql_chain.invoke({'schema':schema,'question':question}).content.strip()

    def run_query(self,query):
        return self.db.run_query(query)

    def generate_answer(self,question, result):
        prompt = f"""
                You are a data analyst.

                Question:
                {question}

                SQL Result:
                {result}

                Rules:
                - Use ONLY the SQL result.
                - Do NOT invent facts.
                - Do NOT make assumptions.
                - If information is missing, say so.
                - If the result is empty, explicitly state that no records were found.

                Return:

                Answer:
                <answer>

                Explanation:
                <short explanation>
                """
        return self.model.invoke(prompt).content

    def clean_sql(self,sql):
        sql = sql.replace("```sql", "").replace("```", "")
        return sql.strip()

    def validate_sql(self,sql):
        sql_upper = sql.upper()
        for keyword in self.FORBIDDEN:
            if re.search(rf"\b{keyword}\b",sql_upper):
                raise ValueError(
                    f"Unsafe SQL detected: {keyword}"
                )
        
        return True