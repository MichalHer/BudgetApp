from fastapi import Depends, APIRouter

router = APIRouter(
    prefix="/predictions",
    tags = ['Predictions']
)

#get prediction (month -> categories -> account)
#get prediction
#create prediction
#edit prediction
#remove prediction

@router.get("/")
async def get_predictions():
    return {"predictions":"ok"}