import sqlite3
from datetime import datetime

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
            SELECT *
            FROM query_history
            ORDER BY id DESC
        """)

        rows = cursor.fetchall()

        conn.close()

        return rows
        


    