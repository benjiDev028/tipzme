from fastapi import APIRouter, HTTPException, Depends,FastAPI
from sqlalchemy.orm import Session
from app.db.database import get_db
import logging
from app.db.schemas.shift import ShiftCreate, ShiftResponse
from app.services.shift_service import create_shift, get_shift_by_id


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
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")
    return shift