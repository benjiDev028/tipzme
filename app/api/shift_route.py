from fastapi import APIRouter, HTTPException, Depends,FastAPI
from sqlalchemy.orm import Session
from app.db.database import get_db
import logging
from app.db.schemas.shift import ShiftCreate, ShiftResponse, ShiftUpdate, ShiftComplete
from app.services.shift_service import create_shift, get_shift_by_id, get_all_shifts_user, get_all_shifts, get_all_shifts_by_status,update_shift,delete_shift,get_shift_with_accepted_colleagues, complete_shift, cancel_shift
from typing import List

router = APIRouter()
app = FastAPI()

# Configurer le logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



@router.post("/create", response_model=ShiftResponse)
async def create_shift_route(shift: ShiftCreate, db: Session = Depends(get_db)):
    """
    Crée un nouvel utilisateur dans la base de données et lui attribue des points.
    """
    # Créer un nouvel utilisateur
    new_shift = await create_shift(db, shift)
    db.commit()
    return new_shift

@router.get("/get_shift_by_id/{shift_id}", response_model=ShiftResponse)
async def get_shift_route(shift_id: str, db: Session = Depends(get_db)):
    """
    Récupère un utilisateur par son ID.
    """
    shift = await get_shift_by_id(db, shift_id)
    return shift

@router.get("/get_all_shifts_user/{creator_id}", response_model=list)
async def get_all_shifts_user_route(creator_id: str, db: Session = Depends(get_db)):
    """
    Récupère tous les shifts du createur avec son id .
    """
    shifts = await get_all_shifts_user(db, creator_id)
    return shifts

@router.get("/get_all_shifts", response_model=list)
async def get_all_shifts_route(db: Session = Depends(get_db)):
    """
    Récupère tous les shifts.
    """
    shifts = await get_all_shifts(db)
    return shifts

@router.get("/get_shift_by_status/{status}", response_model=list)
async def get_shift_by_status_route(status: str, db: Session = Depends(get_db)):
    """"
    "Récupère un shifts par son status.
    """
    shifts = await get_all_shifts_by_status(db, status)
    return shifts

@router.put("/update_shift/{shift_id}", response_model=ShiftResponse)
async def update_shift_route(shift_id: str, shift: ShiftUpdate, db: Session = Depends(get_db)):
    """
    Met à jour un shift par son ID.
    """
    return await update_shift(db, shift_id, shift)

@router.delete("/delete_shift/{shift_id}")
async def delete_shift_route(shift_id: str, db: Session = Depends(get_db)):
    """
    Supprime un shift par son ID.
    """
    shift = await delete_shift(db, shift_id)    
    return {"message": "Shift deleted successfully"}



@router.get("/shifts/{shift_id}/accepted_colleagues")
async def get_shift_accepted_colleagues_api(shift_id: str, db: Session = Depends(get_db)):
    """
    Endpoint pour récupérer les infos du shift + les collègues qui ont accepté
    """
    shift_data = await get_shift_with_accepted_colleagues(db, shift_id)
    return shift_data

@router.put("/complete")
async def complete_shift_endpoint(shiftC:ShiftComplete, db: Session = Depends(get_db)):
    return await complete_shift(db, shiftC)

@router.put("/cancel")
async def cancel_shift_endpoint(shift_id: str, user_id: str, db: Session = Depends(get_db)):
    return await cancel_shift(db, shift_id, user_id)
