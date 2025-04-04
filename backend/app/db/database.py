from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os 

# Charge les variables d'environnement depuis le fichier .env
# Utile pour ne pas exposer directement les infos sensibles dans le code(mot de passe ou URL de DB)
load_dotenv()
DATABASE_URL= os.getenv("DATABASE_URL")

# Crée une "engine" SQLAlchemy => Une connexion avec la DB 
# C'est avec engine que SQLAlchemy va exécuter les requêtes SQL en arrière plan
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
) # Pour SQLite, on doit désactiver check_same_thread car SQLAlchemy utilise des threads (sinon erreur)


# Fabrique une classe de session
# autocommit=False => on doit commit() manuellement
# autoflush=False => Pas de synchro automatique entre les onjets et la base
# bind=engine => La session est lié à l'engine qu'on vient de créer
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Chaque classe qui hérite de Base sera interprétée comme une table par SQLAlchemy
Base = declarative_base()