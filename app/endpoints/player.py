from typing import Annotated

from fastapi import APIRouter, HTTPException, Depends

from app.auth.authentication import Authentication
from app.enums.role import RoleEnum
from app.request_models.player import PlayerRequest, PlayerRequestAssignTeam
from app.models.base import db_dependency
from app.models.player import Player
from starlette import status

router = APIRouter(
    prefix="/player",
    tags=["player"]
)

user_dependency = Authentication.user_dependency

@router.get("/all", status_code=status.HTTP_200_OK)
async def get_all_players(user: user_dependency, db: db_dependency):
    Authentication.validate_user_login(user)
    players = db.query(Player).all()

    return players

@router.get("/get/{player_id}", status_code=status.HTTP_200_OK)
async def get_player(user: user_dependency, db: db_dependency, player_id: int):
    Authentication.validate_user_login(user)
    player = db.query(Player).filter(Player.id == player_id).first()

    return player

@router.get("/get/team_rating/{assigned_team}", status_code=status.HTTP_200_OK)
async def get_team_rating(user: user_dependency, db: db_dependency, assigned_team: str):
    Authentication.validate_user_login(user)
    players = db.query(Player).filter(Player.assigned_team == assigned_team)
    if players.first() is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No players assigned to this team")
    rating: float = 0.0
    count: int = 0

    for player in players:
        average_rating: float = 0.00
        average_rating += player.defence_rating + player.offense_rating + player.serve_rating + player.teamplay_rating
        average_rating = average_rating / 4

        rating += average_rating
        count += 1

    rating = rating / count
    return {assigned_team: rating}

@router.post("/new", status_code=status.HTTP_201_CREATED)
async def create_new_player(user: user_dependency, db: db_dependency, player: PlayerRequest):
    Authentication.validate_user_login(user)
    if user["role"] != RoleEnum.Admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only Admin role may access this endpoint")

    new_player = Player(**player.model_dump())

    db.add(new_player)
    db.commit()

@router.put("/update/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_player(user: user_dependency, db: db_dependency, player_request: PlayerRequest, player_id: int):
    Authentication.validate_user_login(user)
    if user["role"] != RoleEnum.Admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only Admin role may access this endpoint")

    player_model = db.query(Player).filter(Player.id == player_id).first()
    if player_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")

    player_model.name = player_request.name
    player_model.age = player_request.age
    player_model.defence_rating = player_request.defence_rating
    player_model.offense_rating = player_request.offense_rating
    player_model.serve_rating = player_request.serve_rating
    player_model.teamplay_rating = player_request.teamplay_rating
    player_model.available = False
    player_model.gender = player_request.gender

    db.add(player_model)
    db.commit()

@router.put("/available/{player_id}/{availability}", status_code=status.HTTP_204_NO_CONTENT)
async def update_player_availability(user: user_dependency, db: db_dependency, player_id: int, availability: bool):
    Authentication.validate_user_login(user)
    if user["role"] not in [RoleEnum.Admin, RoleEnum.Editor]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only Admin role may access this endpoint")

    player_model = db.query(Player).filter(Player.id == player_id).first()
    if player_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")

    player_model.available = availability

    db.add(player_model)
    db.commit()

@router.put("/assign-team/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
async def assign_team(user: user_dependency, db: db_dependency, player_request: PlayerRequestAssignTeam, player_id: int):
    Authentication.validate_user_login(user)
    if user["role"] not in [RoleEnum.Admin, RoleEnum.Editor]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only Admin role may access this endpoint")

    player_model = db.query(Player).filter(Player.id == player_id).first()
    if player_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")

    player_model.assigned_team = player_request.assigned_team
    db.add(player_model)
    db.commit()

@router.delete("/delete/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_player(user: user_dependency, db: db_dependency, player_id: int):
    Authentication.validate_user_login(user)
    if user["role"] != RoleEnum.Admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only Admin role may access this endpoint")

    player_model = db.query(Player).filter(Player.id == player_id).first()
    if player_model is not None:
        db.delete(player_model)
        db.commit()
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")