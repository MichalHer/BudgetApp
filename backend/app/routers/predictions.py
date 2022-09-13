from fastapi import Depends, APIRouter, Response
from typing import Optional, List
from sqlalchemy.orm import Session
from .. import schemas, models, oauth2, exceptions
from ..database import get_db

router = APIRouter(
    prefix="/predictions",
    tags = ['Predictions']
)

#create prediction
@router.post("/", status_code=201, response_model=schemas.PredictionOut)
def create_prediction(prediction:schemas.PredictionIn, db:Session = Depends(get_db), current_user:models.User = Depends(oauth2.get_current_user)):
    new_prediction = models.Prediction(**prediction.dict())
    new_prediction.owner = current_user.ID_Usr
    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)
    return new_prediction

#get predictions
@router.get("/", response_model = List[schemas.PredictionOut])
def get_predictions(db:Session = Depends(get_db), current_user:models.User=Depends(oauth2.get_current_user), since: Optional[str] = None,
                   to: Optional[str] = None, category_id:Optional[int]=None, account_id:Optional[int]=None):
    
    prediction_query = db.query(models.Prediction).filter((models.Prediction.owner == current_user.ID_Usr))

    if since != None:
        prediction_query = prediction_query.filter((models.Prediction.date >= since))
    if to != None:
        prediction_query = prediction_query.filter((models.Prediction.date <= to))
    
    predictions = prediction_query.all()
    if category_id != None: predictions = list(filter(lambda x: x.category == category_id,predictions))
    if account_id != None: predictions = list(filter(lambda x: x.account == account_id,predictions))
    return predictions

#edit prediction
@router.patch("/{id}", response_model=schemas.PredictionOut)
def edit_prediction(id:int, new_attributes:schemas.PredictionChange, db:Session = Depends(get_db), current_user:models.User=Depends(oauth2.get_current_user)):
    prediction_query = db.query(models.Prediction).filter(models.Prediction.ID_Pred == id)
    prediction = prediction_query.first()
    if not prediction:
        exceptions.raise_option_not_allowed()
    if prediction.owner != current_user.ID_Usr:
        exceptions.raise_option_not_allowed()
    new_attributes_dict = new_attributes.dict()
    keys_to_delete = []
    [keys_to_delete.append(x) for x in new_attributes_dict.keys() if new_attributes_dict[x] == None]
    [new_attributes_dict.pop(x) for x in keys_to_delete]
    prediction_query.update(new_attributes_dict,synchronize_session=False)
    db.commit()
    db.refresh(prediction)
    return prediction

#remove prediction
@router.delete("/{id}", status_code=204)
def remove_prediction(id:int, db:Session = Depends(get_db), current_user:models.User=Depends(oauth2.get_current_user)):
    deleted_prediction_query = db.query(models.Prediction).filter(models.Prediction.ID_Pred == id)
    deleted_prediction = deleted_prediction_query.first()
    if not deleted_prediction:
        exceptions.raise_option_not_allowed()
    if deleted_prediction.owner != current_user.ID_Usr:
        exceptions.raise_option_not_allowed()
    deleted_prediction_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=204)