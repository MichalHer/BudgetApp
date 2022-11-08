from fastapi import Depends, APIRouter, Response
from typing import Optional, List
from sqlalchemy.orm import Session
from .. import schemas, models, oauth2, exceptions
from ..database import get_db
import datetime

router = APIRouter(
    prefix="/operations",
    tags = ['Operations']
)

#create operation
@router.post("/", response_model=schemas.OperationOut, status_code=201)
def create_operation(operation:schemas.Operation, db:Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    new_operation = models.Operation(**operation.dict())
    new_operation.owner = current_user.ID_Usr
    db.add(new_operation)
    db.commit()
    db.refresh(new_operation)
    return new_operation
    
#get operations
@router.get("/", response_model=List[schemas.OperationOut])
def get_operations(db:Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user), since: Optional[str] = None,
                   to: Optional[str] = None, category_id:Optional[int]=None, account_id:Optional[int]=None, prediction_id:Optional[int]=None):

    operations_query = db.query(models.Operation).filter((models.Operation.owner == current_user.ID_Usr))    
    if since != None:
        operations_query = operations_query.filter((models.Operation.date >= since))
    if to != None:
        operations_query = operations_query.filter((models.Operation.date <= to))
    
    operations = operations_query.all()
    
    if category_id != None: operations = list(filter(lambda x: x.category == category_id,operations))
    if account_id != None: operations = list(filter(lambda x: x.account == account_id,operations))
    if prediction_id != None: operations = list(filter(lambda x: x.prediction == prediction_id,operations))
    return operations

#edit operation
@router.patch("/{id}", response_model=schemas.OperationOut)
def edit_operation(id:int, new_attributes:schemas.PredictionChange, db:Session = Depends(get_db), current_user:models.User=Depends(oauth2.get_current_user)):
    operation_query = db.query(models.Operation).filter(models.Operation.ID_Op == id)
    operation = operation_query.first()
    if not operation:
        exceptions.raise_option_not_allowed()
    if operation.owner != current_user.ID_Usr:
        exceptions.raise_option_not_allowed()
    new_attributes_dict = {key:val for key,val in new_attributes.dict().items() if val != None}
    operation_query.update(new_attributes_dict,synchronize_session=False)
    db.commit()
    db.refresh(operation)
    return operation

#remove operation
@router.delete("/{id}", status_code=204)
def remove_operation(id:int, db:Session = Depends(get_db), current_user:models.User=Depends(oauth2.get_current_user)):
    deleted_operation_query = db.query(models.Operation).filter(models.Operation.ID_Op == id)
    deleted_operation = deleted_operation_query.first()
    if not deleted_operation:
        exceptions.raise_option_not_allowed()
    if deleted_operation.owner != current_user.ID_Usr:
        exceptions.raise_option_not_allowed()
    deleted_operation_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=204)