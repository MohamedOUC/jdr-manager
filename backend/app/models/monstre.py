from sqlalchemy import Column, Integer, String
from app.db.database import Base
from sqlalchemy.dialects.sqlite import JSON


class Monstre(Base):
    __tablename__ = "monstres"
    
    id = Column(Integer, primary_key=True, index=True) # Indéxé pour faciliter la recherche (par id dans ce cas là)
    nom = Column(String, index=True) # Pareil ici on pourra faire une recherche pas nom 
    niveau = Column(Integer)
    
    vigilance = Column(Integer)
    initiative = Column(Integer)
    initiative_bonus = Column(String) # ex: "Si 3 rats : +1 initiative"
    
    pv_max = Column(Integer)
    res = Column(Integer)
    xp = Column(Integer)
    pieces = Column(Integer)
    
    attaques = Column(JSON) # En json et non en text pour pouvoir structurer la liste des monstres par la suite
    capacites = Column(JSON) 
    
    description = Column(String)
    
    image = Column(String, nullable=True)