import sqlite3

AUTH_DB = "auth.db"


class AuthDB:

    @staticmethod
    def init_db():

        conn = sqlite3.connect(
            AUTH_DB
        )

        cursor = conn.cursor()

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            username TEXT UNIQUE NOT NULL,

            email TEXT UNIQUE NOT NULL,

            hashed_password TEXT NOT NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )
        """)

        conn.commit()
        conn.close()

    @staticmethod
    def get_connection():

        return sqlite3.connect(
            AUTH_DB
        )