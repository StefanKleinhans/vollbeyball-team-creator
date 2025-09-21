from fastapi import APIRouter, Depends
from starlette import status

from app.models.users import Users
from app.models.base import db_dependency
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

from app.request_models.auth import Token
from app.request_models.users import UserRequest
from app.config.auth import AuthConfig
from app.auth.authentication import Authentication

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

user_dependency = Authentication.user_dependency

@router.get("/profile")
async def get_user_profile(db: db_dependency, user: user_dependency):
    Authentication.validate_user_login(user)
    user_model = db.query(Users).filter(Users.id == user["id"]).first()

    return user_model

@router.post("/create")
async def create_user(db: db_dependency, create_user_request: UserRequest):
    create_user_model = Users(
        email = create_user_request.email,
        username = create_user_request.username,
        first_name = create_user_request.first_name,
        last_name = create_user_request.last_name,
        hashed_password = AuthConfig.bcrypt_context.hash(create_user_request.password),
        is_active = True,
        role = create_user_request.role
    )

    db.add(create_user_model)
    db.commit()

@router.post("/token", response_model=Token)
async def login_for_access_token(db: db_dependency, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = Authentication.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        return 'Failed Authentication'
    token = Authentication.create_access_token(username=user.username, user_id=user.id, expires_delta=timedelta(minutes=20))

    return {'access_token': token, 'token_type': 'bearer'}

@router.put("/reset-password", status_code=status.HTTP_204_NO_CONTENT)
async def reset_password(db: db_dependency, user: user_dependency, new_password: str):
    Authentication.validate_user_login(user)
    user_model = db.query(Users).filter(Users.id == user["id"]).first()
    user_model.hashed_password = AuthConfig.bcrypt_context.hash(new_password)

    db.add(user_model)
    db.commit()
