from datetime import datetime
import os
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from ..db.models.verification import Verification
from uuid import UUID
import aio_pika
import logging
import json
from app.db.schemas.verification import VerificationCreate, VerificationResponse, VerificationListResponse,VerificationUpdate

UPLOAD_DIR = "uploaded_documents"
BASE_URL = "http://192.168.2.13:8002"  # URL de base pour les fichiers

RABBITMQ_URL = os.getenv("RABBITMQ_URL")
QUEUE_NAME = "send_image_agent"

async def send_image_agent(user_dict: dict) -> None:
    """Envoi d'un message structuré à RabbitMQ pour lire le ecrit de limage ."""
    try:
        # Connexion à RabbitMQ
        connection = await aio_pika.connect_robust(RABBITMQ_URL)
        channel = await connection.channel()  
        queue = await channel.declare_queue(QUEUE_NAME, durable=True)

        # Sérialiser le message en JSON
        message_json = json.dumps(user_dict)
        
        # Création du message RabbitMQ
        message = aio_pika.Message(body=message_json.encode())

        # Envoi du message à RabbitMQ
        await channel.default_exchange.publish(message, routing_key=queue.name)
        logging.info(f"Message envoyé à RabbitMQ pour lire ")

    except Exception as e:
        logging.error(f"Erreur lors de l'envoi du message RabbitMQ : {str(e)}")




async def create_user_directory(user_id: str) -> str:
    date_str = datetime.now().strftime("%Y-%m-%d")
    user_folder = f"{UPLOAD_DIR}/{user_id}_{date_str}"
    os.makedirs(user_folder, exist_ok=True)
    return user_folder

async def save_document_info(db: Session, data: VerificationCreate) -> Verification:
    verification = Verification(
        user_id=data.user_id,
        id_document_type=data.id_document_type,  # Utilisez directement la valeur de l'enum
        id_document_url=data.id_document_url,
        # work_document_type=data.work_document_type,  # Utilisez directement la valeur de l'enum
        # work_document_url=data.work_document_url,
        selfie_url=data.selfie_url,
        status="pending"  # Statut par défaut
    )
    db.add(verification)
    db.commit()
    db.refresh(verification)
    return verification





async def upload_documents(
    db: Session,
    user_id: str,
    id_document_type: str,
    identity_card: UploadFile,
    selfie: UploadFile
) -> VerificationResponse:
    try:
        user_folder = await  create_user_directory(user_id)

        id_document_path = f"{user_folder}/identity_card.jpg"
        selfie_path = f"{user_folder}/selfie.jpg"

        with open(id_document_path, "wb") as f:
            f.write(identity_card.file.read())


        with open(selfie_path, "wb") as f:
            f.write(selfie.file.read())

        # Convertir les chemins locaux en URL valides
        id_document_url = f"{BASE_URL}/{id_document_path}"
        selfie_url = f"{BASE_URL}/{selfie_path}"

        verification_data = VerificationCreate(
            user_id=user_id,
            id_document_type=id_document_type,
            id_document_url=id_document_url,
            selfie_url=selfie_url
        )
        user_dict={
            "user_id":str(user_id),

            "selfie_url":selfie_url,
        }
        await send_image_agent(user_dict)
        verification = await save_document_info(db, verification_data)
        return VerificationResponse.from_orm(verification)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


async def get_user_documents(db: Session, user_id: UUID) -> VerificationListResponse:
    """
    Récupère tous les documents d'un utilisateur spécifique.
    """
    documents = db.query(Verification).filter(Verification.user_id == user_id).all()
    
    # Convertir les objets SQLAlchemy en dictionnaires
    document_dicts = [doc.__dict__ for doc in documents]
    
    # Créer une liste de VerificationResponse
    verification_responses = [VerificationResponse(**doc) for doc in document_dicts]
    
    return VerificationListResponse(verifications=verification_responses)

async def get_all_documents(db: Session) -> VerificationListResponse:
    """
    Récupère tous les documents de tous les utilisateurs.
    """
    documents = db.query(Verification).all()
    
    # Convertir les objets SQLAlchemy en dictionnaires
    document_dicts = [doc.__dict__ for doc in documents]
    
    # Créer une liste de VerificationResponse
    verification_responses = [VerificationResponse(**doc) for doc in document_dicts]
    
    return VerificationListResponse(verifications=verification_responses)

async def update_verification_status(
    db: Session,
    verification_id: UUID,
    verification_update: VerificationUpdate
) -> VerificationResponse:
    """
    Met à jour le statut d'une vérification et enregistre l'ID de l'admin et la date de révision.
    """
    # Récupérer la vérification
    verification = db.query(Verification).filter(Verification.id == verification_id).first()
    if not verification:
        raise ValueError("Vérification non trouvée")

    # Mettre à jour le statut et les informations de révision
    verification.status = verification_update.status
    verification.reviewed_by = verification_update.reviewed_by
    verification.reviewed_at = datetime.now()

    # Sauvegarder les modifications
    db.commit()
    db.refresh(verification)

    # Convertir l'objet SQLAlchemy en modèle Pydantic
    return VerificationResponse.from_orm(verification)