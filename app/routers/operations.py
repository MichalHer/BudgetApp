from fastapi import Depends, APIRouter, Response
from typing import Optional, List
from sqlalchemy.orm import Session
from .. import schemas, models, oauth2, exceptions
from ..database import get_db

router = APIRouter(
    prefix="/operations",
    tags = ['Operations']
)

#create operation
@router.post("/", response_model=schemas.Operation, status_code=201)
def create_operation(operation:schemas.Operation, db:Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    new_operation = models.Operation(**operation.dict())
    new_operation.owner = current_user.ID_Usr
    db.add(new_operation)
    db.commit()
    db.refresh(new_operation)
    return new_operation
    
#get operations
@router.get("/", response_model=List[schemas.Operation])
def get_operations(db:Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user), year:int = 1970, month:int=0,
                   category_id:Optional[int]=0, account_id:Optional[int]=0, prediction_id:Optional[int]=0):
    if year < 1970:
        exceptions.raise_year_error(year)
    if month not in range(1,13):
        exceptions.raise_month_error(month)
    left_date = f"{year}-{month}-01"
    if month != 12:
        right_date = f"{year}-{month+1}-01"
    else:
        right_date = f"{year+1}-01-01"
    operations_query = db.query(models.Operation).filter((models.Operation.date.between(left_date,right_date)),
                                                          (models.Operation.owner == current_user.ID_Usr))
    operations = operations_query.all()
    if category_id != 0: operations = list(filter(lambda x: x.category == category_id,operations))
    if account_id != 0: operations = list(filter(lambda x: x.account == account_id,operations))
    if prediction_id != 0: operations = list(filter(lambda x: x.prediction == prediction_id,operations))
    return operations

#edit operation
@router.patch("/{id}", response_model=schemas.Operation)
def edit_operation(id:int, new_attributes:schemas.PredictionChange, db:Session = Depends(get_db), current_user:models.User=Depends(oauth2.get_current_user)):
    operation_query = db.query(models.Operation).filter(models.Operation.ID_Op == id)
    operation = operation_query.first()
    if not operation:
        exceptions.raise_option_not_allowed()
    if operation.owner != current_user.ID_Usr:
        exceptions.raise_option_not_allowed()
    new_attributes_dict = new_attributes.dict()
    keys_to_delete = []
    [keys_to_delete.append(x) for x in new_attributes_dict.keys() if new_attributes_dict[x] == None]
    [new_attributes_dict.pop(x) for x in keys_to_delete]
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