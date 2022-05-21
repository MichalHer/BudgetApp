from fastapi import Depends, APIRouter

router = APIRouter(
    prefix="/categories",
    tags = ['Categories']
)

#get categories
#get category by id
#create category
#edit category
#remove category

@router.get("/")
async def get_categories():
    return {"categories":"ok"}