from pydantic import BaseModel

from app.enums.role import RoleEnum

class UserRequest(BaseModel):
    email: str
    username: str
    first_name: str
    last_name: str
    password: str
    is_active: bool
    role: RoleEnum