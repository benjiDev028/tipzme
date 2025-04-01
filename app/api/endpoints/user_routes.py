from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.schemas.user import UserResponse, UserResponseFind, UserUpdate
from typing import List
from app.db.models.user import User
from app.services.user_service import get_user_by_email, get_user_by_id,get_users, update_user, delete_user


from fastapi import FastAPI, HTTPException, Depends, Request
from starlette.responses import JSONResponse
from uuid import UUID
import logging
from dotenv import load_dotenv
import os

# Charger les variables d'environnement
load_dotenv()
RABBITMQ_URL = os.getenv("RABBITMQ_URL")

router = APIRouter()
app = FastAPI()

# Configurer le logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



@router.get("/get_user_by_email/{email}", response_model=UserResponse)
async def user_by_email(email: str, db: Session = Depends(get_db)):
    """
    Récupère un utilisateur par son email.
    """
    logger.info(f"Requête reçue pour récupérer les points de l'utilisateur avec l'email: {email}")
    user = await get_user_by_email(db, email)
    if not user:
        logging.error(f"Utilisateur avec email {email} non trouvé.")
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé.")
    
    return user


@router.get("/get_user_by_id/{id}", response_model=UserResponse)
async def user_by_id(id: UUID, db: Session = Depends(get_db)):
    """
    Récupère un utilisateur par son email.
    """
    logger.info(f"Requête reçue pour récupérer les points de l'utilisateur avec l'email: {id}")
    user = await get_user_by_id(db, id)
    if not user:
        logging.error(f"Utilisateur avec email {id} non trouvé.")
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé.")
    
    return user

@router.get("/users", response_model=List[UserResponseFind])
async def users(db: Session = Depends(get_db)):
    """
    Endpoint pour récupérer tous les utilisateurs.
    """
    return await get_users(db)

@router.put("/put_user_by_id/{user_id}", response_model=UserResponse)
async def update_user_route(user_id: UUID, user: UserUpdate, db: Session = Depends(get_db)):
    """
    Endpoint pour mettre à jour un utilisateur par son ID.
    """

    
    updated_user = await update_user(db=db, user_id=user_id, user=user)
    return updated_user

@router.delete("/delete_user_by_id/{user_id}")
async def delete_user_route(user_id: UUID, db: Session = Depends(get_db)):

    """
    Endpoint pour supprimer un utilisateur par son ID.
    """
    return await delete_user(db=db, user_id=user_id)