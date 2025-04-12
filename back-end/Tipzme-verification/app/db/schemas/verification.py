from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
from uuid import UUID
from pydantic import BaseModel
from datetime import datetime


class DocumentType(str, Enum):
    ID_CARD = "ID_card"
    PASSPORT = "passport"
    DRIVER_LICENSE = "driver_license"

# class WorkDocumentType(str, Enum):
#     work_permit = "work_permit"
#     employer_badge = "employer_badge"
#     CONTRACT = "contract"

class VerificationStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class VerificationCreate(BaseModel):
    user_id: UUID
    id_document_type: DocumentType
    id_document_url: str
    # work_document_type: WorkDocumentType
    # work_document_url: Optional[str] = None
    selfie_url: str
    status: VerificationStatus = VerificationStatus.PENDING 


class VerificationResponse(BaseModel):
    id: UUID
    user_id: UUID
    id_document_type: str
    id_document_url: str
    # work_document_type: str
    # work_document_url: Optional[str] = None
    selfie_url: str
    status: str
    reviewed_by: Optional[UUID] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True  # Ajoute cette ligne
    
class VerificationUpdate(BaseModel):
    status: VerificationStatus  # Nouveau statut
    reviewed_by: UUID 

class VerificationListResponse(BaseModel):
    verifications: List[VerificationResponse]

    class Config:
        from_attributes = True  # Anciennement appelé `orm_mode = True`
        