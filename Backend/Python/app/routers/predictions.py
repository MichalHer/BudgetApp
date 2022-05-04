from fastapi import Depends, APIRouter

router = APIRouter(
    prefix="/predictions",
    tags = ['Predictions']
)

@router.get("/")
async def get_predictions():
    return {"predictions":"ok"}