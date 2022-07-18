from fastapi import Depends, APIRouter

router = APIRouter(
    prefix="/transfers",
    tags = ['Transfers']
)

#get transfers (month -> from account -> to account)
#create transfer
#edit transfer
#remove transfer

@router.get("/")
async def get_transfers():
    return {"transfers":"ok"}