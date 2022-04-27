from fastapi import Depends, APIRouter

router = APIRouter(
    prefix="/categories",
    tags = ['Categories']
)

@router.get("/")
async def get_price():
    return {"categories":"ok"}