import sqlalchemy
from fastapi import Depends, APIRouter, status, Response, HTTPException
from .. import models, schemas, utils
from sqlalchemy.orm import Session
from ..database import engine, get_db
from sqlalchemy import func


router = APIRouter(
    prefix="/users",
    tags = ['Users']
)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    created_user = db.query(models.User).filter(models.User.nick == user.nick). first()
    if created_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=[{"msg": "User already exist"}])
    hashed_password = utils.hash(user.password)
    user.password = hashed_password
    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/{id}", response_model=schemas.UserOut)
async def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.ID_Usr == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=[{"msg": f"User with id: {id} does not exist"}])
    return user