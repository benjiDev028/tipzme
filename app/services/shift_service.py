import logging
from sqlalchemy.orm import Session
from app.db.models.shift import Shift
from fastapi import HTTPException
from app.db.schemas.shift import ShiftCreate, ShiftResponse
import datetime 
import uuid



# Configuration du logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
        logging.FileHandler("shift_logs.log"),  # Nom du fichier de log
        logging.StreamHandler()  # Envoie également les logs à la console
    ])




async def create_shift(db: Session, shift : ShiftCreate) -> ShiftResponse:
    #create a new shift

    logging.info(f"Creating a new shift with data: {shift}")

    new_shift = Shift(
        creator_id=shift.creator_id,
        name_shift=shift.name_shift,
        date=shift.date,
        start_time=shift.start_time,
        end_time=shift.end_time,
        created_at=datetime.datetime.now(),
        updated_at=datetime.datetime.now()

    )
    try:
        db.add(new_shift)
        db.commit()
        db.refresh(new_shift)
        logging.info(f"Shift created with ID: {new_shift.id}")
    except Exception as e:
        db.rollback()
        logging.error(f"Error creating shift: {e}")
        raise
    return ShiftResponse.from_orm(new_shift)

async def get_shift_by_id(db: Session, shift_id: uuid) -> ShiftResponse:

    # Get a shift by its ID
    logging.info(f"Fetching shift with ID: {shift_id}")
    shift = db.query(Shift).filter(Shift.id == shift_id).first()
    if not shift:
        logging.error(f"Shift with ID {shift_id} not found")
        raise HTTPException(status_code=404, detail="Shift not found")
    return ShiftResponse.from_orm(shift)