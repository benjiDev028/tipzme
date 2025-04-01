from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Date,
    Time,
    Boolean,
    create_engine,
    inspect,
    Enum
    

)
from datetime import datetime,time
from sqlalchemy import Date 

import uuid
from enum import Enum as PyEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

load_dotenv()


# Base de SQLAlchemy
Base = declarative_base()

# Configurer le moteur de base de données
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL doit être défini dans le fichier .env")

engine = create_engine(DATABASE_URL)

# Configurer la session
Session = sessionmaker()


class shiftStatus(str, PyEnum):
    active = "active"
    finished = "finished"
    cancelled = "canceled"

# Modèle shift
class Shift(Base):
    __tablename__ = "shifts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_id = Column(UUID(as_uuid=True), nullable=False)
    name_shift = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    status = Column(Enum(shiftStatus), default=shiftStatus.active)
    created_at = Column(DateTime, default=datetime.utcnow)  # ✅ Correct
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
