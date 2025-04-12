from datetime import datetime
from uuid import uuid4
import logging
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv
from fastapi import HTTPException
from app.db.models.user import User
from app.core.security import get_password_hash
import aio_pika
import json
import os



from app.db.schemas.user import UserCreate, UserResponse

# Configuration du logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

load_dotenv()

# URL de RabbitMQ
RABBITMQ_URL = os.getenv("RABBITMQ_URL")
QUEUE_NAME = "activate_compte_queue"

async def send_activation_email(user_dict: dict) -> None:
    """Envoi d'un message structuré à RabbitMQ pour activer le compte utilisateur."""
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
        logging.info(f"Message envoyé à RabbitMQ pour activer l'email : {user_dict['email']}")

    except Exception as e:
        logging.error(f"Erreur lors de l'envoi du message RabbitMQ : {str(e)}")

async def create_user(db: Session, user: UserCreate) -> UserResponse:
    """
    Crée un nouvel utilisateur dans la base de données.
    """
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        logging.error(f"Un utilisateur avec l'email {user.email} existe déjà.")
        raise HTTPException(status_code=400, detail="Un utilisateur avec cet email existe déjà.")
    
    logging.info("Création d'un nouvel utilisateur...")

    # Hachage du mot de passe et génération du "salt"
    hashed_password, salt = get_password_hash(user.password)

    # Créer un nouvel utilisateur
    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone_number=user.phone_number,
        date_birth=user.date_birth,
        password_hash=hashed_password,
        password_salt=salt,
        is_email_verified=False,  # Par défaut, l'email n'est pas vérifié
        is_phone_verified=False,  # Par défaut, le téléphone n'est pas vérifié
        is_active=False,  # Par défaut, l'utilisateur est actif
        created_at=datetime.now().replace(microsecond=0).strftime("%Y-%m-%d %H:%M"),
        updated_at=datetime.now().replace(microsecond=0).strftime("%Y-%m-%d %H:%M")
    )

    try:
        # Ajouter l'utilisateur à la base de données
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        logging.info(f"Nouvel utilisateur créé avec succès : {new_user.email}")

        user_dict = {
            "email": new_user.email,
            "id": str(new_user.id),  # UUID -> string pour sérialisation JSON
           }

        # Envoi d'un message à RabbitMQ pour activer le compte utilisateur
        await send_activation_email(user_dict)

    except Exception as e:
        logging.error(f"Erreur lors de la création de l'utilisateur : {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Erreur interne lors de la création de l'utilisateur.")
    
    return new_user
