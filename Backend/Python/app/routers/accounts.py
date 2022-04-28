import sqlalchemy
from fastapi import Depends, APIRouter, status, Response, HTTPException
from .. import models, schemas, utils, oauth2
from sqlalchemy.orm import Session
from ..database import engine, get_db
from sqlalchemy import func

router = APIRouter(
    prefix="/accounts",
    tags = ['Accounts']
)

@router.get("/")
async def get_price():
    return {"accounts":"ok"}

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.AccountOut)
async def createAccount(account: schemas.AccountCreate, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
        new_account = models.Account(**account.dict())
        db.add(new_account)
        db.commit()
        db.refresh(new_account)
        statement = models.association_table.insert().values(user_id=current_user.ID_Usr, account_id=new_account.ID_Acc)
        db.execute(statement)
        db.commit()
        return new_account

@router.post("/attach_to/{id}", response_model=schemas.AccountOut)
async def addUser(id: int, attached_user: schemas.UserAttaching, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    relationships = db.query(models.Account).filter(models.Account.ID_Acc == id).first()

    if not current_user in relationships.owners:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=[{"msg": f"operation not allowed"}])

    attached_user_model = db.query(models.User).filter(models.User.nick == attached_user.nick).first()
    statement = models.association_table.insert().values(user_id=attached_user_model.ID_Usr, account_id=id)
    db.execute(statement)
    db.commit()
    account = db.query(models.Account).filter(models.Account.ID_Acc==id).first()
    return account

