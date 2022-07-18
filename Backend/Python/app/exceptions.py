from fastapi import HTTPException, status

def raise_option_not_allowed():
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=[{"msg": f"operation not allowed"}])

def raise_invalid_credentials():
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=[{"msg": f"Invalid Credentials"}])

def raise_user_already_exists():
    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=[{"msg": "User already exists"}])

def raise_user_does_not_exists():
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                        detail=[{"msg": f"User does not exist"}])

def raise_account_does_not_exists():
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                        detail=[{"msg": f"Account does not exist"}])

def raise_credentials_exception():
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                                            detail=[{"msg": f"Could not validate credentials"}], 
                                            headers={"WWW-Authenticte": "Bearer"})
    
def raise_not_category_owner_or_doesnt_exists():
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                                            detail=[{"msg": f"You are not category owner or category doesn't exists"}])
    
def raise_year_error(year):
    raise HTTPException(status_code=400, 
                        detail=[{"msg": f"given year ({year}) have wrong value"}])
    
def raise_month_error(month):
    raise HTTPException(status_code=400, 
                        detail=[{"msg": f"given month ({month}) have wrong value"}])