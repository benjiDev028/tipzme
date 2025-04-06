import logging
from sqlalchemy.orm import Session
from app.db.models.shift import Shift
from app.db.models.shift_colleagues import ShiftColleague
from fastapi import HTTPException
from app.db.schemas.shift import ShiftCreate, ShiftResponse, ShiftUpdate, ShiftStatusFind
from datetime import datetime
import uuid
from typing import List



# Configuration du logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
        logging.FileHandler("shift_logs.log"),  # Nom du fichier de log
        logging.StreamHandler()  # Envoie également les logs à la console
    ])




async def create_shift(db: Session, shift: ShiftCreate) -> ShiftResponse:
    logging.info(f"Creating a new shift with data: {shift}")

    current_date = datetime.now().date()
    current_time = datetime.now().time()

    # ⛔ Vérifier que la date du shift n’est pas dans le passé
    if shift.date < current_date:
        raise HTTPException(status_code=400, detail="La date du shift ne peut pas être dans le passé")

    # ⛔ Si la date est aujourd’hui, vérifier que l’heure de début est dans le futur
    if shift.date == current_date and shift.start_time < current_time:
        raise HTTPException(status_code=400, detail="L'heure de début ne peut pas être dans le passé")

    # ⛔ Vérifier que l’heure de fin est après l’heure de début
    if shift.start_time >= shift.end_time:
        raise HTTPException(status_code=400, detail="L'heure de fin doit être après l'heure de début")

    new_shift = Shift(
        creator_id=shift.creator_id,
        name_shift=shift.name_shift,
        date=shift.date,
        start_time=shift.start_time,
        end_time=shift.end_time,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    try:
        db.add(new_shift)
        db.commit()
        db.refresh(new_shift)
        logging.info(f"Shift created with ID: {new_shift.id}")
    except Exception as e:
        db.rollback()
        logging.error(f"Error creating shift: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la création du shift")

    return ShiftResponse.from_orm(new_shift)

async def get_shift_by_id(db: Session, shift_id: uuid) -> ShiftResponse:

    # Get a shift by its ID
    logging.info(f"Fetching shift with ID: {shift_id}")
    shift = db.query(Shift).filter(Shift.id == shift_id).first()
    if not shift:
        logging.error(f"Shift with ID {shift_id} not found")
        raise HTTPException(status_code=404, detail="Shift not found")
    return ShiftResponse.from_orm(shift)

async def get_all_shifts_user(db: Session,user_id:uuid) -> list:
    # Get all shifts for a user

    logging.info(f"Fetching all shifts")
    shifts = db.query(Shift).filter(Shift.creator_id == user_id).all()
    if not shifts:
        logging.error(f"No shifts found")
        raise HTTPException(status_code=404, detail="No shifts found")
    return [ShiftResponse.from_orm(shift) for shift in shifts]

async def get_all_shifts(db: Session) -> list:
    # Get all shifts
    logging.info(f"Fetching all shifts")
    shifts = db.query(Shift).all()
    if not shifts:
        logging.error(f"No shifts found")
        raise HTTPException(status_code=404, detail="No shifts found")
    return [ShiftResponse.from_orm(shift) for shift in shifts]

async def get_all_shifts_by_status(db: Session, status:str) -> List[ShiftResponse]:
    # Get all shifts by status
    logging.info(f"Fetching all shifts with status: {status}")
    shifts = db.query(Shift).filter(Shift.status == status).all()
    if not shifts:
        logging.error(f"No shifts found with status {status}")
        raise HTTPException(status_code=404, detail="No shifts found")
    return [ShiftResponse.from_orm(shift) for shift in shifts]

async def update_shift(db: Session, shift_id: uuid, shift_data: ShiftUpdate) -> ShiftResponse:
    # Update a shift
    logging.info(f"Updating shift with ID: {shift_id}")
    shift = await db.query(Shift).filter(Shift.id == shift_id).first()
    if not shift:
        logging.error(f"Shift with ID {shift_id} not found")
        raise HTTPException(status_code=404, detail="Shift not found")
    try:
        

        shift.name_shift = shift_data.name_shift
        shift.date = shift_data.date
        shift.start_time = shift_data.start_time
        shift.end_time = shift_data.end_time
        shift.updated_at = datetime.datetime.now()
        db.commit()
        db.refresh(shift)
        logging.info(f"Shift with ID {shift_id} updated")
    except Exception as e:
        db.rollback()
        logging.error(f"Error updating shift: {e}")
        raise
    return ShiftResponse.from_orm(shift)

async def delete_shift(db:Session,shift_id:uuid):
    # Delete a shift
    logging.info(f"Deleting shift with ID: {shift_id}")
    shift =  db.query(Shift).filter(Shift.id == shift_id).first()
    if not shift:
        logging.error(f"Shift with ID {shift_id} not found")
        raise HTTPException(status_code=404, detail="Shift not found")
    try:
        db.delete(shift)
        db.commit()
        logging.info(f"Shift with ID {shift_id} deleted")
    except Exception as e:
        db.rollback()
        logging.error(f"Error deleting shift: {e}")
        raise

async def get_shift_with_accepted_colleagues(db: Session, shift_id: uuid) -> dict:
    """ Récupère les infos du shift + les collègues qui ont accepté """
    
    # Vérifier si le shift existe et est actif (status == "active")
    shift = db.query(Shift).filter(Shift.id == shift_id, Shift.status == "active").first()
    
    if not shift:
        raise HTTPException(status_code=404, detail="Shift non trouvé ou inactif")
    

    # Récupérer les collègues qui ont accepté le shift
    accepted_colleagues = (
        db.query(ShiftColleague)
        .filter(ShiftColleague.shift_id == shift_id, ShiftColleague.status == "accepted")
        .all()
    )
    if not accepted_colleagues:
        raise HTTPException(status_code=404, detail="Aucun collègue n'a accepté ce shift")
    


    return {
        "shift_id": shift.id,
        "name_shift": shift.name_shift,
        "date": shift.date,
        "start_time": shift.start_time,
        "end_time": shift.end_time,
        "status": shift.status,
        "accepted_colleagues": [
            {"user_id": colleague.user_id}  # On ne retourne que l'ID du collègue
            for colleague in accepted_colleagues
        ]
    }
    
async def get_shift_by_creator_id(db: Session, creator_id: uuid) -> List[ShiftResponse]:
    """Récupère les shifts par ID du créateur."""
    Shifts =db.query(Shift).filter(Shift.creator_id == creator_id).all()
    if not Shifts:
        logging.error(f"No shifts found for creator with ID {creator_id}")
        raise HTTPException(status_code=404, detail="No shifts found")
    return [ShiftResponse.from_orm(shift) for shift in Shifts]

