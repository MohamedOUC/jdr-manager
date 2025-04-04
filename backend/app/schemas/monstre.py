from pydantic import BaseModel

# Première classe qui représente les champs communs aux montres sans l'ID
class MonstreBase(BaseModel):
    nom: str
    niveau: int
    type: str
    description: str

# Cas où l'on veut créer un monstre en appelant la classe crée plus haut
class MonstreCreate(MonstreBase):
    pass

# Utilisé pour une lecture depuis la base en ajoutant ID ici et non lors de la création du monstre
class Monstre(MonstreBase):
    id: int
    
    class Config:
        orm_mode = True # Permet de dire à Pydantic que les données ne vienent pas que d'un dict mais aussi d'un ORM