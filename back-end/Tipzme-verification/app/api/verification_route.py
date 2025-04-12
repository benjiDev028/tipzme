from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from ..db.schemas.verification import VerificationResponse, VerificationListResponse,VerificationUpdate
from ..services.verification_service import upload_documents, get_user_documents, get_all_documents,update_verification_status
from ..db.database import get_db

router = APIRouter()

@router.post("/upload-documents", response_model=VerificationResponse)
async def upload_documents_endpoint(
    user_id: UUID,
    id_document_type: str,
    identity_card: UploadFile = File(...),
    selfie: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    return  await upload_documents(db, user_id, id_document_type, identity_card, selfie)

@router.get("/users/documents/{user_id}", response_model=VerificationListResponse)
async def get_user_documents_endpoint(
    user_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Endpoint pour récupérer tous les documents d'un utilisateur spécifique.
    """
   
    return await get_user_documents(db, user_id)
   
@router.get("/documents", response_model=VerificationListResponse)
async def get_all_documents_endpoint(

    db: Session = Depends(get_db)
):
    """
    Endpoint pour récupérer tous les documents de tous les utilisateurs.
    """
  
    return await get_all_documents(db)
  
    

@router.put("/verifications/{verification_id}", response_model=VerificationResponse)
async def update_verification(
    verification_id: UUID,
    verification_update: VerificationUpdate,
    db: Session = Depends(get_db)
):
    """
    Endpoint pour mettre à jour le statut d'une vérification.
    """
   
        # Mettre à jour le statut dans la base de données
    updated_verification = await  update_verification_status(db, verification_id, verification_update)

        # # Envoyer un message RabbitMQ avec l'email de l'utilisateur et la décision
        # message = {
        #     "email": "user@example.com",  # Remplacez par l'email de l'utilisateur
        #     "decision": verification_update.status,
        #     "message": "Félicitations, vous êtes approuvé !" if verification_update.status == "approved" else "Désolé, vous n'êtes pas approuvé. Veuillez nous contacter."
        # }
        # send_rabbitmq_message("verification_status", message)

    return updated_verification
    