import sqlalchemy
from fastapi import Depends, APIRouter, status
from .. import models, schemas, utils, oauth2, exceptions
from sqlalchemy.orm import Session
from ..database import get_db


router = APIRouter(
    prefix="/accounts",
    tags = ['Accounts']
)

@router.get("/")
async def get_accounts():
    return {"accounts":"ok"}


# get all user accounts
# get account owners
# delete user from account owners
# change account name

#create account
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.AccountOut)
async def create_account(account: schemas.AccountCreate, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
        new_account = models.Account(**account.dict())
        db.add(new_account)
        db.commit()
        db.refresh(new_account)
        statement = models.association_table.insert().values(user_id=current_user.ID_Usr, account_id=new_account.ID_Acc)
        db.execute(statement)
        db.commit()
        return new_account

#attach user to account
@router.post("/attach_to/{id}", response_model=schemas.AccountOut)
async def add_user(id: int, attached_user: schemas.UserAttaching, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    relationships = db.query(models.Account).filter(models.Account.ID_Acc == id).first()

    if not current_user in relationships.owners:
        exceptions.raise_option_not_allowed()

    attached_user_model = db.query(models.User).filter(models.User.nick == attached_user.nick).first()
    if not attached_user_model:
        exceptions.raise_user_does_not_exists()

    statement = models.association_table.insert().values(user_id=attached_user_model.ID_Usr, account_id=id)
    db.execute(statement)
    db.commit()
    account = db.query(models.Account).filter(models.Account.ID_Acc==id).first()
    return account

