from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserAttaching(BaseModel):
    nick: str

class UserCreate(BaseModel):
    nick: str
    password: str

class UserOut(BaseModel):
    nick: str
    created_at: datetime
    class Config:
        orm_mode=True

class AccountCreate(BaseModel):
    name: str

class AccountOut(BaseModel):
    ID_Acc: int
    name: str
    owners: List[UserOut]
    class Config:
        orm_mode=True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None