from sqlalchemy.orm import Session
from app.db.models.address import Address
from app.db.schemas.address import AddressCreate, AddressUpdate
from fastapi import HTTPException
from uuid import UUID

async def create_address(db: Session, address_data: AddressCreate) -> Address:
    address = Address(**address_data.dict())
    db.add(address)
    db.commit()
    db.refresh(address)
    return address

async def get_address_by_user(db: Session, user_id: UUID) -> Address:
    address = db.query(Address).filter(Address.user_id == user_id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Adresse non trouvée")
    return address

async def update_address(db: Session, user_id: UUID, update_data: AddressUpdate) -> Address:
    address = db.query(Address).filter(Address.user_id == user_id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Adresse non trouvée")
    for key, value in update_data.dict().items():
        setattr(address, key, value)
    db.commit()
    db.refresh(address)
    return address

async def delete_address(db: Session, user_id: UUID):
    address = db.query(Address).filter(Address.user_id == user_id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Adresse non trouvée")
    db.delete(address)
    db.commit()
    return {"detail": "Adresse supprimée"}
