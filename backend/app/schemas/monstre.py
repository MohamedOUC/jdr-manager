from pydantic import BaseModel
from typing import Optional, List

class Attaque(BaseModel):
    nom: str
    effet: str
    fo: Optional[int] = None
    ad: Optional[int] = None
    limite: Optional[str] = None

class Capacite(BaseModel):
    nom: str
    effet: str
    etat: Optional[str] = None

# Première classe qui représente les champs communs aux montres sans l'ID
class MonstreBase(BaseModel):
    nom: str
    niveau: int
    
    vigilance: int
    initiative:int
    initiative_bonus: Optional[str]
    
    pv_max: int
    res: int
    xp: int
    pieces: int
    
    attaques: List[Attaque] # On veut structurer les attaques / capacités
    capacites: List[Capacite]
    
    description: str
    image: Optional[str] = None

# Cas où l'on veut créer un monstre en appelant la classe crée plus haut
class MonstreCreate(MonstreBase):
    pass

# Utilisé pour une lecture depuis la base en ajoutant ID ici et non lors de la création du monstre
class Monstre(MonstreBase):
    id: int

    
    class Config:
        orm_mode = True # Permet de dire à Pydantic que les données ne vienent pas que d'un dict mais aussi d'un ORM