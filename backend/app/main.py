from fastapi import FastAPI
from app.models import monstre
from app.db.database import Base, engine
from app.api import monstre as monstre_api

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(monstre_api.router)