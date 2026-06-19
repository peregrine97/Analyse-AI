from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from jose import JWTError, jwt

from auth.security import (
    SECRET_KEY,
    ALGORITHM
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def get_current_user(
    token: str = Depends(
        oauth2_scheme
    )
):

    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials"
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get(
            "sub"
        )

        email = payload.get(
            "email"
        )

        if user_id is None:

            raise credentials_exception

        return {
            "id": int(user_id),
            "email": email
        }

    except JWTError:

        raise credentials_exception