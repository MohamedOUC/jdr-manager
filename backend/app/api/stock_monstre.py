from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.stock_monstre import Monstre as MonstreModel
from app.schemas.stock_monstre import MonstreCreate, Monstre as MonstreSchema

router = APIRouter(prefix="/monstres-stockes", tags=["Monstres "])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.get("/", response_model=list[MonstreSchema])
def get_all_monstres(db: Session = Depends(get_db)):
    return db.query(MonstreModel).all()

@router.post("/", response_model=MonstreSchema)
def create_monstre(monstre: MonstreCreate, db: Session = Depends(get_db)):
    db_monstre = MonstreModel(**monstre.dict())
    db.add(db_monstre)
    db.commit()
    db.refresh(db_monstre)
    return db_monstre

@router.put("/{monstre_id}", response_model=MonstreSchema)
def update_monstre(monstre_id: int, monstre: MonstreCreate, db: Session = Depends(get_db)):
    db_monstre = db.query(MonstreModel).filter(MonstreModel.id == monstre_id).first()
    if not db_monstre:
        raise HTTPException(status_code=404, detail="Monstre non trouvé")
    
    for key, value in monstre.dict().items():
        setattr(db_monstre, key, value)
        
    db.commit()
    db.refresh(db_monstre)
    return db_monstre

@router.delete("/{monstre_id}")
def delete_monstre(monstre_id: int, db: Session = Depends(get_db)):
    monstre = db.query(MonstreModel).filter(MonstreModel.id == monstre_id).first()
    if not monstre:
        raise HTTPException(status_code=404, detail="Monstre non trouvé")
    db.delete(monstre)
    db.commit()
    return {"message": "Supprimé avec succès ✅"}