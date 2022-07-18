from fastapi import Depends, APIRouter

router = APIRouter(
    prefix="/operations",
    tags = ['Operations']
)

#create operation
#get operations (by month -> account -> categories -> predictions)
#edit operation
#remove operation

@router.get("/")
async def get_operations():
    return {"operations":"ok"}