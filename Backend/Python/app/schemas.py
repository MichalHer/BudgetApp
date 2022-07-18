from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserAttaching(BaseModel):
    nick: str

class UserCreate(BaseModel):
    nick: str
    password: str
    class Config:
        orm_mode=True
    
class ChangePassword(BaseModel):
    password: str

class UserOut(BaseModel):
    nick: str
    created_at: datetime
    class Config:
        orm_mode=True

class AccountCreate(BaseModel):
    name: str

class Account(BaseModel):
    ID_Acc: int
    name: str
    class Config:
        orm_mode=True

class AccountOut(Account):
    owners: List[UserOut]
    class Config:
        orm_mode=True

class AccountsList(BaseModel):
    accounts: List[Account]
    class Config:
        orm_mode=True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None
    
class CreateCategoryInput(BaseModel):
    name: str
    class Config:
        orm_mode=True
        
class CreateCategoryOutput(CreateCategoryInput):
    ID_Cat: int

        
class CategoryList(BaseModel):
    categories: List[CreateCategoryOutput]
    class Config:
        orm_mode=True