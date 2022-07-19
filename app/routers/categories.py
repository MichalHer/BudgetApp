from operator import ge
from fastapi import Depends, APIRouter, Response
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, oauth2, exceptions
from ..database import get_db

router = APIRouter(
    prefix="/categories",
    tags = ['Categories']
)


#create category
@router.post("/", response_model = schemas.CreateCategoryOutput, status_code=201)
async def create_category(category: schemas.CreateCategoryInput, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    new_category = models.Category(**category.dict())
    new_category.owner = current_user.ID_Usr
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

#get categories
@router.get("/", response_model=List[schemas.CreateCategoryOutput])
async def get_categories(db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    categories = db.query(models.Category).filter(models.Category.owner == current_user.ID_Usr).all()
    return categories


#get category by id
@router.get("/{id}", response_model=schemas.CreateCategoryOutput)
async def get_categories(id:int, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    category = db.query(models.Category).filter((models.Category.owner == current_user.ID_Usr),
                                                models.Category.ID_Cat == id).first()
    if not category:
        exceptions.raise_not_category_owner_or_doesnt_exists()
        
    return category

#edit category
@router.patch("/{id}", response_model=schemas.CreateCategoryOutput)
async def edit_category(new_category_name:schemas.CreateCategoryInput, id:int, db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    schema_querry = db.query(models.Category).filter(models.Category.ID_Cat == id)
    schema = schema_querry.first()
    if schema.owner != current_user.ID_Usr:
        raise exceptions.raise_not_category_owner_or_doesnt_exists()
    schema_querry.update(new_category_name.dict(), synchronize_session=False)
    db.commit()
    db.refresh(schema)
    return schema
    
    
#remove category
@router.delete("/{id}", status_code=204)
def remove_category(id:int, db:Session = Depends(get_db), current_user:models.User = Depends(oauth2.get_current_user)):
    deleted_category_query = db.query(models.Category).filter(models.Category.ID_Cat == id)
    deleted_category = deleted_category_query.first()
    if not deleted_category:
        exceptions.raise_not_category_owner_or_doesnt_exists()
    if deleted_category.owner != current_user.ID_Usr:
        exceptions.raise_not_category_owner_or_doesnt_exists()
    deleted_category_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=204)