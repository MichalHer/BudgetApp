from fastapi import Depends, APIRouter

router = APIRouter(
    prefix="/users",
    tags = ['Users']
)

@router.get("/")
async def get_price():
    return {"users":"ok"}