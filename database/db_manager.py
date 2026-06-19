import sqlite3
import pandas as pd

class DatabaseManager:
    def __init__(self,db_path="temp.db"):
        self.db_path = db_path

    def get_table_names(self):

        conn = sqlite3.connect(self.db_path)

        cursor = conn.cursor()

        cursor.execute("""
            SELECT name
            FROM sqlite_master
            WHERE type='table'
            AND name NOT IN (
                'query_history',
                'sqlite_sequence'
            )
            ORDER BY name
        """)

        tables = [
            row[0]
            for row in cursor.fetchall()
        ]

        conn.close()

        return tables
    
    def get_table_columns(self, table_name):

        conn = sqlite3.connect(
            self.db_path
        )

        cursor = conn.cursor()

        cursor.execute(
            f'PRAGMA table_info("{table_name}")'
        )

        columns = [
            row[1]
            for row in cursor.fetchall()
        ]

        conn.close()

        return columns
    
    def preview_table(self, table_name):

        conn = sqlite3.connect(
            self.db_path
        )

        df = pd.read_sql_query(
            f'SELECT * FROM "{table_name}" LIMIT 5',
            conn
        )

        conn.close()

        return df

    def save_dataframe(self,df, table_name):
        conn = sqlite3.connect(self.db_path)
        df.to_sql(
            table_name,conn,if_exists="replace",index = False
        )
        conn.close()

    def run_query(self, query):

        conn = sqlite3.connect(self.db_path)

        cursor = conn.cursor()

        cursor.execute(query)

        rows = cursor.fetchall()

        columns = [
            desc[0]
            for desc in cursor.description
        ]

        conn.close()

        return {
            "columns": columns,
            "rows": rows
        }
    
    def get_table_row_count(self, table_name):

        conn = sqlite3.connect(self.db_path)

        cursor = conn.cursor()

        cursor.execute(
            f'SELECT COUNT(*) FROM "{table_name}"'
        )

        count = cursor.fetchone()[0]

        conn.close()

        return count