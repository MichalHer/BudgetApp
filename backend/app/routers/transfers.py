from operator import or_
from pyexpat import model
from fastapi import Depends, APIRouter, Response
from .. import schemas, models, oauth2, exceptions
from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..database import get_db
from typing import List, Optional

router = APIRouter(
    prefix="/transfers",
    tags = ['Transfers']
)

#create transfer
@router.post("/", status_code=201, response_model=schemas.Transfer)
def create_transfer(transfer:schemas.TransferIn, db:Session = Depends(get_db), current_user:models.User = Depends(oauth2.get_current_user)):
    new_transfer = models.Transfer(**transfer.dict())
    accounts = db.query(models.Account).filter(or_((models.Account.ID_Acc == new_transfer.from_account),
                                                   (models.Account.ID_Acc == new_transfer.to_account))).all()
    db.commit()
    [exceptions.raise_option_not_allowed() for x in accounts if current_user not in x.owners]
    if len(accounts) != 2: exceptions.raise_option_not_allowed()
    new_transfer.owner = current_user.ID_Usr
    db.add(new_transfer)
    db.commit()
    db.refresh(new_transfer)
    return new_transfer
    
#get transfers (month -> from account -> to account)
@router.get("/", response_model = List[schemas.Transfer])
def get_transfers(db:Session = Depends(get_db), current_user:models.User=Depends(oauth2.get_current_user), since: Optional[str] = None,
                   to: Optional[str] = None, from_id:Optional[int]=None, to_id:Optional[int]=None):
    
    transfers_query = db.query(models.Transfer).filter((models.Transfer.owner == current_user.ID_Usr))
    
    if since != None:
        transfers_query = transfers_query.filter((models.Transfer.date >= since))
    if to != None:
        transfers_query = transfers_query.filter((models.Transfer.date <= to))
    
    transfers = transfers_query.all()
    if from_id != None: transfers = list(filter(lambda x: x.from_account == from_id,transfers))
    if to_id != None: transfers = list(filter(lambda x: x.to_account == to_id,transfers))
    return transfers

#edit transfer
@router.patch("/{id}", response_model=schemas.Transfer)
def edit_transfer(id:int, new_attributes:schemas.TransferChange, db:Session = Depends(get_db), current_user:models.User=Depends(oauth2.get_current_user)):
    transfer_query = db.query(models.Transfer).filter(models.Transfer.ID_Tr == id)
    transfer = transfer_query.first()
    if not transfer:
        exceptions.raise_option_not_allowed()
    if transfer.owner != current_user.ID_Usr:
        exceptions.raise_option_not_allowed()
    new_attributes_dict = new_attributes.dict()
    keys_to_delete = []
    [keys_to_delete.append(x) for x in new_attributes_dict.keys() if new_attributes_dict[x] == None]
    [new_attributes_dict.pop(x) for x in keys_to_delete]
    transfer_query.update(new_attributes_dict,synchronize_session=False)
    db.commit()
    db.refresh(transfer)
    return transfer

#remove transfer
@router.delete("/{id}", status_code=204)
def remove_transfer(id:int, db:Session = Depends(get_db), current_user:models.User=Depends(oauth2.get_current_user)):
    deleted_transfer_query = db.query(models.Transfer).filter(models.Transfer.ID_Tr == id)
    deleted_transfer = deleted_transfer_query.first()
    if not deleted_transfer:
        exceptions.raise_option_not_allowed()
    if deleted_transfer.owner != current_user.ID_Usr:
        exceptions.raise_option_not_allowed()
    deleted_transfer_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=204)