import sqlite3

class DatabaseManager:
    def __init__(self,db_path="temp.db"):
        self.db_path = db_path

    def save_dataframe(self,df, table_name):
        conn = sqlite3.connect(self.db_path)
        df.to_sql(
            table_name,conn,if_exists="replace",index = False
        )
        conn.close()

    def run_query(self,query):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(query)

        result = cursor.fetchall()
        conn.close()

        return result