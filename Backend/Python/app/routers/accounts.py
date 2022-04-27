from fastapi import Depends, APIRouter

router = APIRouter(
    prefix="/accounts",
    tags = ['Accounts']
)

@router.get("/")
async def get_price():
    return {"accounts":"ok"}