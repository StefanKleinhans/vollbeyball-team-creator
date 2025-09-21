from fastapi import FastAPI
from models.base import Base
from config.database import engine
from endpoints import player
from endpoints import auth

app = FastAPI(root_path="/app")

Base.metadata.create_all(bind=engine)

app.include_router(player.router)
app.include_router(auth.router)