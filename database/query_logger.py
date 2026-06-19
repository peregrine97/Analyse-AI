import sqlite3
from datetime import datetime
import json

class QueryLogger : 
    def __init__(self,db_path = "temp.db"):
        self.db_path = db_path
        self.create_table()

    def create_table(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("""CREATE TABLE IF NOT EXISTS query_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            question TEXT,
            sql_query TEXT,
            result TEXT,
            success INTEGER
        )""")

        conn.commit()
        conn.close()

    def log(self,question,sql_query,result,success):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO query_history
        (
            timestamp,
            question,
            sql_query,
            result,
            success
        )
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            str(datetime.now()),
            question,
            sql_query,
            str(result),
            int(success)
        ))

        conn.commit()
        conn.close()

    def get_history(self):

        conn = sqlite3.connect(
            self.db_path
        )

        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                id,
                timestamp,
                question,
                sql_query,
                result,
                success
            FROM query_history
            ORDER BY id DESC
        """)

        rows = cursor.fetchall()

        conn.close()

        history = []

        for row in rows:

            try:
                result_data = json.loads(row[4])
            except:
                result_data = {
        "error": "Legacy history entry"
    }

            history.append({
                "id": row[0],
                "timestamp": row[1],
                "question": row[2],
                "sql_query": row[3],
                "result": result_data,
                "success": bool(row[5])
            })

        return history
        


    