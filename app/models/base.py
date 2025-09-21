from fastapi import Depends
from typing import Annotated
from app.config.database import Base, SessionLocal
from sqlalchemy.orm import Session

Base = Base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]