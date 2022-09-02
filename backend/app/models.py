from email.policy import default
from sqlalchemy import Column, Integer, String, Date, Numeric, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text
from .database import Base

association_table = Table('association', Base.metadata,
    Column('user_id', ForeignKey('users.ID_Usr', ondelete="CASCADE")),
    Column('account_id', ForeignKey('accounts.ID_Acc',ondelete="CASCADE"))
)

class User(Base):
    __tablename__ = "users"

    ID_Usr = Column(Integer, primary_key=True)
    nick = Column(String(20), nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    accounts = relationship("Account",
                    secondary=association_table,
                    back_populates = "owners")

class Account(Base):
    __tablename__ = "accounts"

    ID_Acc = Column(Integer, primary_key=True)
    name = Column(String(20), nullable=False)
    currency = Column(String(3), nullable=False, server_default="PLN")
    owners = relationship("User",
                    secondary=association_table,
                    back_populates = "accounts")
    

class Transfer(Base):
    __tablename__ = "transfers"

    ID_Tr = Column(Integer, primary_key=True)
    owner = Column(Integer, ForeignKey("users.ID_Usr", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    value = Column(Numeric(decimal_return_scale=2), nullable=False)
    from_account = Column(Integer, ForeignKey("accounts.ID_Acc"), nullable=False)
    to_account = Column(Integer, ForeignKey("accounts.ID_Acc"), nullable=False)

class Category(Base):
    __tablename__ = "categories"

    ID_Cat  = Column(Integer, primary_key=True)
    name = Column(String(20), nullable=False)
    owner = Column(Integer, ForeignKey("users.ID_Usr", ondelete="CASCADE"), nullable=False)

class Prediction(Base):
    __tablename__ = "predictions"

    ID_Pred = Column(Integer, primary_key=True)
    value = Column(Numeric(decimal_return_scale=2), nullable=False)
    purpose_of_the_expendture = Column(String(20), nullable=False)
    date = Column(Date, nullable=False)
    account = Column(Integer, ForeignKey("accounts.ID_Acc", ondelete="CASCADE"), nullable=False)
    category = Column(Integer, ForeignKey("categories.ID_Cat"), nullable=False)
    owner = Column(Integer, ForeignKey("users.ID_Usr", ondelete="CASCADE"), nullable=False)

class Operation(Base):
    __tablename__ = "operations"

    ID_Op = Column(Integer, primary_key=True)
    value = Column(Numeric(decimal_return_scale=2), nullable=False)
    purpose_of_the_expendture = Column(String(20), nullable=False)
    date = Column(Date, nullable=False)
    owner = Column(Integer, ForeignKey("users.ID_Usr", ondelete="CASCADE"), nullable=False)
    prediction = Column(Integer, ForeignKey("predictions.ID_Pred"))
    account = Column(Integer, ForeignKey("accounts.ID_Acc", ondelete="CASCADE"), nullable=False)
    category = Column(Integer, ForeignKey("categories.ID_Cat"), nullable=False)