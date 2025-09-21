from app.config.database import Base
from sqlalchemy import Column, Integer, String, Float, Boolean


class Player(Base):
    __tablename__ = 'players'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    age = Column(Integer)
    defence_rating = Column(Float)
    offense_rating = Column(Float)
    teamplay_rating = Column(Float)
    serve_rating = Column(Float)
    available = Column(Boolean, default=False)
    assigned_team = Column(String)
    gender = Column(String)