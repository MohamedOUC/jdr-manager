from fastapi import FastAPI
from app.models import board_monstre
from app.db.database import Base, engine
from app.api import board_monstre as board_monstre_api
from app.api import stock_monstre as stock_monstre_api
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'], # Autorise toutes les origines => à modifier en "http://localhost:3000", "http://172.17.139.10:3000" pour la version prod / finale
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(board_monstre_api.router)
app.include_router(stock_monstre_api.router)