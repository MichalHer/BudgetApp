from fastapi import Depends, APIRouter

router = APIRouter(
    prefix="/operations",
    tags = ['Operations']
)

#get operations (by month -> account -> categories -> predictions)
#get operation
#create operation
#edit operation
#remove operation

@router.get("/")
async def get_operations():
    return {"operations":"ok"}