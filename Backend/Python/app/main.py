from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import accounts, categories, operations, predictions, transfers, users

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(accounts.router)
app.include_router(categories.router)
app.include_router(operations.router)
app.include_router(predictions.router)
app.include_router(transfers.router)
app.include_router(users.router)

@app.get("/")
async def root():
    return {"connection_status": "ok"}