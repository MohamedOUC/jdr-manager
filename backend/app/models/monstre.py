from sqlalchemy import Column, Integer, String
from app.db.database import Base

class Monstre(Base):
    __tablename__ = "monstres"
    
    id = Column(Integer, primary_key=True, index=True) # Indéxé pour faciliter la recherche (par id dans ce cas là)
    nom = Column(String, index=True) # Pareil ici on pourra faire une recherche pas nom 
    niveau = Column(Integer)
    type = Column(String)
    description = Column(String)