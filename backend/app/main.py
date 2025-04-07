from fastapi import FastAPI
from app.models import monstre
from app.db.database import Base, engine
from app.api import monstre as monstre_api
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

app.include_router(monstre_api.router)