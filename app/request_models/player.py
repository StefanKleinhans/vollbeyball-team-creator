from pydantic import BaseModel

class PlayerRequest(BaseModel):
    name: str
    age: int
    defence_rating: float
    offense_rating: float
    teamplay_rating: float
    serve_rating: float
    available: bool
    assigned_team: str
    gender: str

class PlayerRequestAssignTeam(BaseModel):
    assigned_team: str