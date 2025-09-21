from datetime import timedelta, datetime, timezone
from typing import Annotated

from fastapi import Depends, HTTPException
from jose import jwt, JWTError
from starlette import status

from app.config.auth import AuthConfig
from app.models.users import Users
from app.models.base import db_dependency

class Authentication:
    _SECRET_KEY = AuthConfig.SECRET_KEY
    _ALGORITHM = AuthConfig.ALGORITHM

    @staticmethod
    def authenticate_user(username: str, password: str, db):
        user = db.query(Users).filter(Users.username == username).first()
        if not user:
            return False
        if not AuthConfig.bcrypt_context.verify(password, user.hashed_password):
            return False
        return user

    @classmethod
    def create_access_token(cls, username: str, user_id: int, expires_delta: timedelta):
        encode = {'sub': username, 'id': user_id}
        expires = datetime.now(timezone.utc) + expires_delta
        encode.update({'exp': expires})

        return jwt.encode(encode, cls._SECRET_KEY, algorithm=cls._ALGORITHM)

    @staticmethod
    def get_current_user(token: Annotated[str, Depends(AuthConfig.oauth2_bearer)], db: db_dependency):
        try:
            payload = jwt.decode(token, Authentication._SECRET_KEY, algorithms=[Authentication._ALGORITHM])
            username: str = payload.get('sub')
            user_id: int = payload.get('id')
            if username is None or user_id is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                    detail='Could not validate user')
            user = db.query(Users).filter(Users.id == user_id).first()
            return {'user': username, 'id': user_id, 'role': user.role}
        except JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Could not validate user')

    user_dependency = Annotated[dict, Depends(get_current_user)]

    @staticmethod
    def validate_user_login(user: user_dependency):
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
