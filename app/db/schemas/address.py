from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class AddressBase(BaseModel):
    street: str
    street_number: str
    apartment: Optional[str] = None
    city: str
    postal_code: str
    country: str

class AddressCreate(AddressBase):
    user_id: UUID

class AddressUpdate(AddressBase):
    pass

class AddressResponse(AddressBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
