from pydantic import BaseModel
from typing import Optional, List, Dict

class Attaque(BaseModel):
    nom: str
    degats: str
    effet: str
    limite: Optional[str] = None

class Capacite(BaseModel):
    nom: str
    effet: str
    limite: Optional[str] = None

class MonstreBase(BaseModel):
    nom: str
    niveau: int
    pv_max: int
    res: int
    initiative: int
    initiative_bonus: Optional[str] = None
    fo: int
    ad: int
    mag: int
    xp: int
    pieces: int

    attaques: List[Attaque] = []
    capacites: List[Capacite] = []

    stats_flexibles: Dict[str, int] = {}  # <== NOUVEAU
    image: Optional[str] = None

class MonstreCreate(MonstreBase):
    pass

class MonstreUpdate(MonstreCreate):
    pass 

class Monstre(MonstreBase):
    id: int

    class Config:
        orm_mode = True