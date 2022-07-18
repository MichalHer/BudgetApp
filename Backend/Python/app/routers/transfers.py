from operator import or_
from fastapi import Depends, APIRouter
from .. import schemas, models, oauth2, exceptions
from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..database import get_db

router = APIRouter(
    prefix="/transfers",
    tags = ['Transfers']
)

#create transfer
@router.post("/", response_model=schemas.Transfer)
def create_transfer(transfer:schemas.Transfer, db:Session = Depends(get_db), current_user:models.User = Depends(oauth2.get_current_user)):
    new_transfer = models.Transfer(**transfer.dict())
    accounts = db.query(models.Account).filter(or_((models.Account.ID_Acc == new_transfer.from_account),
                                                   (models.Account.ID_Acc == new_transfer.to_account))).all()
    [exceptions.raise_option_not_allowed() for x in accounts if current_user not in x.owners]
    if len(accounts) != 2: exceptions.raise_option_not_allowed()
    db.add(new_transfer)
    db.commit()
    db.refresh(new_transfer)
    return new_transfer
    
    
#get transfers (month -> from account -> to account)
#edit transfer
#remove transfer