from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from uuid import UUID
from typing import Optional

# Schéma pour la notification d'email (ex. code de vérification)
class NotificationRequest(BaseModel):
    email: EmailStr
    code: int

    class Config:
        orm_mode = True  # Permet de manipuler des objets ORM directement


class GenerateCodeRequest(BaseModel):
    email: EmailStr


# Schéma de base pour l'utilisateur (les champs communs à tous les utilisateurs)
class UserBase(BaseModel):
    first_name: str = Field(..., max_length=100)
    last_name: str = Field(..., max_length=100)
    email: EmailStr
    phone_number: Optional[str] = Field(None, max_length=15)  # Numéro de téléphone optionnel
    date_birth: Optional[datetime]  # Date de naissance au format datetime

    class Config:
        orm_mode = True  # Permet de manipuler des objets ORM directement


# Schéma pour la recherche d'un utilisateur par nom
class UserFindByName(BaseModel):
    first_name: str
    last_name: str

    class Config:
        orm_mode = True


# Schéma pour la recherche d'un utilisateur par email
class UserFindByEmail(BaseModel):
    email: EmailStr

    class Config:
        orm_mode = True


# Schéma pour la recherche d'un utilisateur par date de naissance
class UserFindByBirth(BaseModel):
    date_birth: datetime

    class Config:
        orm_mode = True


# Schéma pour la mise à jour des informations d'un utilisateur
class UserUpdate(UserBase):
   
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[EmailStr]
    phone_number: Optional[str]
    date_birth: Optional[datetime]

    class Config:
        orm_mode = True


# Schéma utilisé pour la création d'un utilisateur
class UserCreate(UserBase):
    password: str  # Mot de passe à créer lors de l'inscription

    class Config:
        orm_mode = True


# Schéma pour l'utilisateur renvoyé après création ou récupération
class UserResponse(UserBase):
    id: UUID
    is_email_verified: bool = False
    is_phone_verified: bool = False
    is_active: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Schéma pour un utilisateur à partir de son ID
class UserFindById(BaseModel):
    id: UUID

    class Config:
        orm_mode = True


# Schéma pour un utilisateur retourné après une recherche (détails complets)
class UserResponseFind(UserBase):
    id: UUID
    is_email_verified: bool
    is_phone_verified: bool
    is_active: bool
    role: str = "worker"  # Par défaut rôle "worker", peut être modifié
    created_at: datetime
    updated_at: datetime
    pointevents: Optional[int] = 0
    pointstudios: Optional[int] = 0

    class Config:
        orm_mode = True


# Schéma représentant l'utilisateur pour des opérations internes (pas d'email à vérifier)
class UserInternal(UserBase):
    id: UUID
    is_email_verified: bool = False
    is_phone_verified: bool = False
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    pointevents: Optional[int] = 0
    pointstudios: Optional[int] = 0

    class Config:
        orm_mode = True
