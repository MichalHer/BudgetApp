from pydantic import BaseSettings
import logging
from datetime import date

class Settings(BaseSettings):

    db_username: str
    db_password: str
    db_ip_address: str
    db_databasename: str
    db_port: str
    jwt_secret_key: str
    jwt_algorithm: str
    jwt_expiring_minutes: int

    class Config:
        env_file=".env"
        
settings = Settings()
