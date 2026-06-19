from fastapi import APIRouter, HTTPException

from auth.auth_db import AuthDB
from auth.schemas import UserRegister, UserLogin
from auth.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

AuthDB.init_db()


@router.post("/register")
def register(user: UserRegister):

    conn = AuthDB.get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id FROM users WHERE email=?",
        (user.email,)
    )

    existing = cursor.fetchone()

    if existing:

        conn.close()

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed = hash_password(
        user.password
    )

    cursor.execute(
        """
        INSERT INTO users
        (
            username,
            email,
            hashed_password
        )
        VALUES (?, ?, ?)
        """,
        (
            user.username,
            user.email,
            hashed
        )
    )

    conn.commit()
    conn.close()

    return {
        "message": "User registered successfully"
    }


@router.post("/login")
def login(user: UserLogin):

    conn = AuthDB.get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            id,
            username,
            email,
            hashed_password
        FROM users
        WHERE email=?
        """,
        (user.email,)
    )

    row = cursor.fetchone()

    conn.close()

    if not row:

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    user_id = row[0]
    username = row[1]
    email = row[2]
    hashed_password = row[3]

    if not verify_password(
        user.password,
        hashed_password
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {
            "sub": str(user_id),
            "email": email
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "username": username,
            "email": email
        }
    }