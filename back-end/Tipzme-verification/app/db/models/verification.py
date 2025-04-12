from sqlalchemy import Column, String, Enum, UUID, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
import uuid
from enum import Enum as PyEnum

Base = declarative_base()

class DocumentType(str, PyEnum):
    ID_CARD = "ID_card"
    PASSPORT = "passport"
    DRIVER_LICENSE = "driver_license"

# class WorkDocumentType(str, PyEnum):
#     WORK_PERMIT = "work_permit"
#     EMPLOYER_BADGE = "employer_badge"
#     CONTRACT = "contract"

class VerificationStatus(str, PyEnum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class Verification(Base):
    __tablename__ = "verifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID, nullable=False)
    id_document_type = Column(Enum(DocumentType), nullable=False)
    id_document_url = Column(String, nullable=False)
    # work_document_type = Column(Enum(WorkDocumentType), nullable=True)
    # work_document_url = Column(String, nullable=True)
    selfie_url = Column(String, nullable=False)
    status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING)
    reviewed_by = Column(PGUUID, nullable=True)
    reviewed_at = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())