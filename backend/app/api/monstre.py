from fastapi import APIRouter, Depends # Créer le groupe de route / Injecter la DB
from sqlalchemy.orm import Session 
from app.db.database import SessionLocal
from app.models.monstre import Monstre as MonstreModel
from app.schemas.monstre import Monstre as MonstreSchema

router = APIRouter()

def get_db():
    db = SessionLocal() # Ouvre une session SQLAlchemy
    try:
        yield db 
    finally:
        db.close() # Ferme automatiquement après la requête
        
@router.get("/monstres", response_model=list[MonstreSchema]) # FastAPI convertit les objets SQLAlchemy en JSON 
def get_monstres(db: Session = Depends(get_db)):
    return db.query(MonstreModel).all() 
    
    