import sqlalchemy
from fastapi import Depends, APIRouter, status
from .. import models, schemas, utils, exceptions
from sqlalchemy.orm import Session
from ..database import get_db


router = APIRouter(
    prefix="/users",
    tags = ['Users']
)

# delete user
# change user password

# create user
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    created_user = db.query(models.User).filter(models.User.nick == user.nick). first()
    if created_user:
        exceptions.raise_user_already_exists()
    hashed_password = utils.hash(user.password)
    user.password = hashed_password
    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# get user by id
@router.get("/{id}", response_model=schemas.UserOut)
async def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.ID_Usr == id).first()
    if not user:
        exceptions.raise_user_does_not_exists()
    return user