from fastapi import FastAPI
from models.base import Base
from config.database import engine
from endpoints import player
from endpoints import auth
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings

app = FastAPI(root_path="/app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(player.router)
app.include_router(auth.router)
