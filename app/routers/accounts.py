import sqlalchemy
from fastapi import Depends, APIRouter, status
from .. import models, schemas, utils, oauth2, exceptions
from sqlalchemy.orm import Session
from ..database import get_db
from typing import List


router = APIRouter(
    prefix="/accounts",
    tags = ['Accounts']
)

# get all user accounts
@router.get("/", response_model=List[schemas.AccountOut])
async def get_accounts_list(db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    accounts_list = db.query(models.Account).filter(models.Account.owners.contains(current_user)).all()
    return accounts_list

# get account info
@router.get("/{id}", response_model=schemas.AccountOut)
async def get_account_owners(id: int, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    account = db.query(models.Account).filter(models.Account.ID_Acc == id).first()
    if not account: exceptions.raise_account_does_not_exists()
    if current_user not in account.owners: exceptions.raise_option_not_allowed()
    return account

# change account name
@router.put("/{id}", response_model=schemas.AccountOut)
async def change_account_name(new_name: schemas.AccountCreate ,id: int, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    account_query = db.query(models.Account).filter(models.Account.ID_Acc == id)

    account = account_query.first()
    if not account: exceptions.raise_account_does_not_exists()
    if current_user not in account.owners: exceptions.raise_option_not_allowed()

    account_query.update(new_name.dict(), synchronize_session=False)
    db.commit()
    
    db.refresh(account)
    return account
    

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
@router.post("/attach_user_to/{id}", response_model=schemas.AccountOut)
async def add_user(id: int, attached_user: schemas.UserAttaching, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    account = db.query(models.Account).filter(models.Account.ID_Acc == id).first()

    if not current_user in account.owners:
        exceptions.raise_option_not_allowed()

    attached_user_model = db.query(models.User).filter(models.User.nick == attached_user.nick).first()
    if not attached_user_model:
        exceptions.raise_user_does_not_exists()

    statement = models.association_table.insert().values(user_id=attached_user_model.ID_Usr, account_id=id)
    db.execute(statement)
    db.commit()
    account = db.query(models.Account).filter(models.Account.ID_Acc==id).first()
    return account

# detach user from account owners
@router.delete("/detach_user_from/{id}", response_model=schemas.AccountOut)
async def add_user(id: int, attached_user: schemas.UserAttaching, db: Session = Depends(get_db), current_user: int = Depends(oauth2.get_current_user)):
    account_query = db.query(models.Account).filter(models.Account.ID_Acc == id)
    account = account_query.first()

    if not current_user in account.owners:
        exceptions.raise_option_not_allowed()

    removed_user_model = db.query(models.User).filter(models.User.nick == attached_user.nick).first()
    if not removed_user_model:
        exceptions.raise_user_does_not_exists()

    account.owners.remove(removed_user_model)
    db.commit()

    db.refresh(account)

    return account
