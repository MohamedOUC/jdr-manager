from fastapi import APIRouter, HTTPException, Depends # Créer le groupe de route / Injecter la DB 
from sqlalchemy.orm import Session 
from app.db.database import SessionLocal
from app.models.board_monstre import Monstre as MonstreModel
from app.schemas.board_monstre import Monstre as MonstreSchema
import json
from pathlib import Path
from app.schemas.board_monstre import MonstreCreate

router = APIRouter(prefix="/monstres-plateau", tags=["Monstres Plateau"])

def get_db():
    db = SessionLocal() # Ouvre une session SQLAlchemy
    try:
        yield db 
    finally:
        db.close() # Ferme automatiquement après la requête
        
@router.get("/board-monstres", response_model=list[MonstreSchema]) # FastAPI convertit les objets SQLAlchemy en JSON 
def get_monstres(db: Session = Depends(get_db)):
    monstres = db.query(MonstreModel).all()
    return [MonstreSchema.from_orm(m) for m in monstres]

@router.post("/import-monstres")
def import_monstres(db: Session = Depends(get_db)):
    try:     
        json_path = Path("app/data/db_monstres.json")
        
        with open(json_path, 'r', encoding="utf-8") as f:
            monstres_data = json.load(f)
            print(monstres_data)
        
        db.query(MonstreModel).delete()
        
        for monstre_dict in monstres_data:
            print("📥 Monstre brut:", monstre_dict)
            monstre = MonstreCreate(**monstre_dict)
            print("✅ Monstre Pydantic validé")
            db_monstre = MonstreModel(
                nom=monstre.nom,
                niveau=monstre.niveau,
                vigilance=monstre.vigilance,
                initiative=monstre.initiative,
                initiative_bonus=monstre.initiative_bonus,
                pv_max=monstre.pv_max,
                res=monstre.res,
                xp=monstre.xp,
                pieces=monstre.pieces,
                attaques=[attaque.dict() for attaque in monstre.attaques],
                capacites=[cap.dict() for cap in monstre.capacites],
                description=monstre.description,
                image=monstre.image
            )
            print("🧱 Ajouté à la session :", db_monstre.nom)
            db.add(db_monstre)
            
        db.commit()

        return {"message": "Importation réussie ✅"}

    except Exception as e:
        print("❌ Erreur pendant l'import :", e)
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")
    
@router.post("/board-monstres")
def create_monstre(monstre: MonstreCreate, db: Session = Depends(get_db)):
    db_monstre = MonstreModel(
        nom=monstre.nom,
        niveau=monstre.niveau,
        pv_max=monstre.pv_max,
        res=monstre.res,
        initiative=monstre.initiative,
        initiative_bonus=monstre.initiative_bonus,
        fo=monstre.fo,
        ad=monstre.ad,
        mag=monstre.mag,
        xp=monstre.xp,
        pieces=monstre.pieces,
        attaques=[a.dict() for a in monstre.attaques],
        capacites=[c.dict() for c in monstre.capacites],
        stats_flexibles=monstre.stats_flexibles,
        image=monstre.image
    )
    db.add(db_monstre)
    db.commit()
    db.refresh(db_monstre)
    
    try:
        path = Path("app/data/db_monstres.json")
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        data.append(monstre.dict())
        
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    except Exception as e:
        print("Erreur ajout JSON:", e)
    
    return {"message": "Monstre ajouté", "id": db_monstre.id}