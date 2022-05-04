from fastapi import Depends, APIRouter

router = APIRouter(
    prefix="/operations",
    tags = ['Operations']
)

@router.get("/")
async def get_operations():
    return {"operations":"ok"}