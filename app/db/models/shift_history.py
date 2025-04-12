from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Enum as SQLEnum
from datetime import datetime
import uuid
from enum import Enum
  # ADAPTE CE IMPORT À TA STRUCTURE

Base = declarative_base()



class ShiftActionEnum(str, Enum):
    modification = "modification"
    cancellation = "cancellation"
    creation = "creation"
    manual_complete = "manual_complete"
    manual_cancel = "manual_cancel"
    automatic_complete = "automatic_complete"

class ShiftHistory(Base):
    __tablename__ = "shift_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    shift_id = Column(UUID(as_uuid=True), nullable=False)
    utilisateur_id = Column(UUID(as_uuid=True), nullable=True)
    action = Column(
        SQLEnum(
            ShiftActionEnum,
            name="shift_action_enum",
            values_callable=lambda x: [e.value for e in x],  # ❤️ LA LIGNE QUI SAUVE DES VIES
            native_enum=False
        ),
        nullable=False,
        default=ShiftActionEnum.creation.value
    )
    date_action = Column(DateTime, default=datetime.utcnow)
    description = Column(String, nullable=True)
