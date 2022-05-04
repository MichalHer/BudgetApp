from fastapi import Depends, APIRouter

router = APIRouter(
    prefix="/transfers",
    tags = ['Transfers']
)

@router.get("/")
async def get_transfers():
    return {"transfers":"ok"}