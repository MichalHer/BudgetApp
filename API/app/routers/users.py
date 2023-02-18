import sqlalchemy
from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
from secrets import token_urlsafe

from .. import exceptions, models, schemas, utils, oauth2
from ..database import get_db

router = APIRouter(
    prefix="/users",
    tags = ['Users']
)

# delete user
@router.delete("/", status_code=204)
async def delete_user(db: Session = Depends(get_db), current_user:models.User = Depends(oauth2.get_current_user)):
    user_querry = db.query(models.User).filter(models.User.ID_Usr == current_user.ID_Usr)
    user = user_querry.first()
    if not user: exceptions.raise_user_does_not_exists()
    user_querry.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=204)

# change user password
@router.patch("/", response_model=schemas.UserCreate)
async def change_password(new_password:schemas.ChangePassword, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    user_querry = db.query(models.User).filter(models.User.ID_Usr == current_user.ID_Usr)
    user = user_querry.first()
    if not user: exceptions.raise_user_does_not_exists()
    hashed_password = utils.hash(new_password.password)
    user_querry.update({"password":hashed_password}, synchronize_session=False)
    db.commit()
    db.refresh(user)
    return user

# create user
@router.post("/", status_code=201, response_model=schemas.UserOut)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    created_user = db.query(models.User).filter(models.User.nick == user.nick). first()
    if created_user:
        exceptions.raise_user_already_exists()
        
    if user.password == None:
        raw_password = token_urlsafe(10)
        user.password = raw_password
    else: 
        raw_password = user.password
        
    hashed_password = utils.hash(raw_password)
    user.password = hashed_password
    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    new_user.password = raw_password
    return new_user

# get user by id
@router.get("/{id}", response_model=schemas.UserOut)
async def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.ID_Usr == id).first()
    if not user:
        exceptions.raise_user_does_not_exists()
    return user
