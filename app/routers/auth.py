from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import database, schemas, utils, models, oauth2, exceptions
from fastapi.security.oauth2 import OAuth2PasswordRequestForm

router = APIRouter(tags=["Authentication"])

#authorize user
@router.post('/login', response_model=schemas.Token)
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.nick == user_credentials.username).first()

    if not user:
        exceptions.raise_invalid_credentials()

    if not utils.verify(user_credentials.password, user.password):
        exceptions.raise_invalid_credentials()

    access_token = oauth2.create_access_token(data={"user_id":user.ID_Usr})

    return {"access_token":access_token, "token_type": "bearer"}