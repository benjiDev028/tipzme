from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from app.db.schemas.address import AddressCreate, AddressUpdate, AddressResponse
from app.services.address_service import create_address, get_address_by_user, update_address, delete_address
from app.db.database import get_db
import logging

router = APIRouter()

# Configurer le logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/create_address", response_model=AddressResponse)
async def create_address_view(address: AddressCreate, db: Session = Depends(get_db)):
    return await create_address(db, address)

@router.get("/get_adresse_user_by_id/{user_id}", response_model=AddressResponse)
async def get_address_view(user_id: UUID, db: Session = Depends(get_db)):
    return await get_address_by_user(db, user_id)

@router.put("/update_adresse_user_by_id/{user_id}", response_model=AddressResponse)
async def update_address_view(user_id: UUID, address: AddressUpdate, db: Session = Depends(get_db)):
    return await update_address(db, user_id, address)

@router.delete("/delete_adresse_user_by_id/{user_id}")
async def delete_address_view(user_id: UUID, db: Session = Depends(get_db)):
    return await delete_address(db, user_id)
