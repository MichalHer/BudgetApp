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
def get_predictions(db:Session = Depends(get_db), current_user:models.User=Depends(oauth2.get_current_user), year:int = 1970, month:int=0, category_id:Optional[int]=0, account_id:Optional[int]=0):
    if year < 1970:
        exceptions.raise_year_error(year)
    if month not in range(1,13):
        exceptions.raise_month_error(month)
    left_date = f"{year}-{month}-01"
    if month != 12:
        right_date = f"{year}-{month+1}-01"
    else:
        right_date = f"{year+1}-01-01"
    prediction_query = db.query(models.Prediction).filter((models.Prediction.date.between(left_date,right_date)),
                                                          (models.Prediction.owner == current_user.ID_Usr))
    predictions = prediction_query.all()
    if category_id != 0: predictions = list(filter(lambda x: x.category == category_id,predictions))
    if account_id != 0: predictions = list(filter(lambda x: x.account == account_id,predictions))
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