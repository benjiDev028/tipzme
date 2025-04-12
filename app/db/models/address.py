from sqlalchemy import (
    Column,
    Integer,
    String,
   
    DateTime,
    ForeignKey,
    
    Boolean
   
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import sessionmaker,relationship
from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy import create_engine, inspect
import uuid
from datetime import datetime,date
from sqlalchemy.sql import func
from dotenv import load_dotenv
import os

# Charger les variables d'environnement
load_dotenv()

# Base de SQLAlchemy
Base = declarative_base()

# Configurer le moteur de base de données
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL doit être défini dans le fichier .env")

engine = create_engine(DATABASE_URL)

# Configurer la session
Session = sessionmaker(bind=engine)


class Address(Base):
    __tablename__ = "addresses"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID, nullable=False)

    street = Column(String, nullable=False)
    street_number = Column(String, nullable=False)
    apartment = Column(String, nullable=True)
    city = Column(String, nullable=False)
    postal_code = Column(String, nullable=False)
    country = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


