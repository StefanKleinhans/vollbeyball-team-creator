from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from .settings import Settings

class AuthConfig:
    SECRET_KEY: str = Settings.SECRET_KEY
    ALGORITHM: str = Settings.ALGORITHM

    bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
    oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')