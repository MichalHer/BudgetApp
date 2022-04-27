from sqlalchemy import Column, Integer, String, Date, BigInteger, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.sql.expression import text
from .database import Base

class User(Base):
    __tablename__ = "users"

    ID_Usr = Column(Integer, primary_key=True)
    nick = Column(String(20), nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))

    accounts = relationship(
        "Account", back_populates="users", cascade="all, delete-orphan"
    )
    transfers = relationship(
        "Transfer", back_populates="transfers", cascade="all, delete-orphan"
    )
    categories = relationship(
        "Category", back_populates="categories", cascade="all, delete-orphan"
    )

class Account(Base):
    __tablename__ = "accounts"

    ID_Acc = Column(Integer, primary_key=True)
    name = Column(String(20), nullable=False)
    owner = Column(Integer, ForeignKey("users.ID_usr"), nullable=False)
    operations = relationship(
        "Operation", back_populates="operations", cascade="all, delete-orphan"
    )
    predictions = relationship(
        "Prediction", back_populates="predictions", cascade="all, delete-orphan"
    )
    

class Transfer(Base):
    __tablename__ = "transfers"

    ID_Tr = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    value = Column(BigInteger, nullable=False)
    owner = Column(Integer, ForeignKey("users.ID_usr"), nullable=False)
    from_account = Column(Integer, ForeignKey("accounts.ID_Acc"), nullable=False)
    to_account = Column(Integer, ForeignKey("accounts.ID_Acc"), nullable=False)

class Category(Base):
    __tablename__ = "categories"

    ID_Cat  = Column(Integer, primary_key=True)
    name = Column(String(20), nullable=False)
    owner = Column(Integer, ForeignKey("users.ID_usr"), nullable=False)

class Prediction(Base):
    __tablename__ = "predictions"

    ID_Pred = Column(Integer, primary_key=True)
    value = Column(BigInteger, nullable=False)
    purpose_of_the_expendture = Column(String(20), nullable=False)
    date = Column(Date, nullable=False)
    account = Column(Integer, ForeignKey("accounts.ID_Acc"), nullable=False)
    category = Column(Integer, ForeignKey("categories.ID_Cat"), nullable=False)


class Operation(Base):
    __tablename__ = "operations"

    ID_Op = Column(Integer, primary_key=True)
    value = Column(BigInteger, nullable=False)
    purpose_of_the_expendture = Column(String(20), nullable=False)
    date = Column(Date, nullable=False)
    prediction = Column(Integer, ForeignKey("predictions.ID_Pred"), nullable=False)
    account = Column(Integer, ForeignKey("accounts.ID_Acc"), nullable=False)
    category = Column(Integer, ForeignKey("categories.ID_Cat"), nullable=False)