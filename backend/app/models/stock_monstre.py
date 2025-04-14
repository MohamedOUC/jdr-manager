from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.sqlite import JSON
from app.db.database import Base

class Monstre(Base):
    __tablename__ = "monstres_stockes"
    __table_args__ = {'extend_existing': True} 
    
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, index=True)
    niveau = Column(Integer)
    pv_max = Column(Integer)
    res = Column(Integer)
    initiative = Column(Integer)
    initiative_bonus = Column(String, nullable=True)

    fo = Column(Integer)
    ad = Column(Integer)
    mag = Column(Integer)
    xp = Column(Integer)
    pieces = Column(Integer)

    attaques = Column(JSON)
    capacites = Column(JSON)
    stats_flexibles = Column(JSON)  # Permet plus de flexibilité

    image = Column(String, nullable=True)