from fastapi import APIRouter, HTTPException, Depends,FastAPI
from sqlalchemy.orm import Session
from app.db.database import get_db
import logging
from app.db.schemas.shift_colleagues import InviteColleague, ShiftColleagueResponse, ActionInvitation
from app.services.shiftColleagues_service import invite_colleague, action_invitation,get_shift_colleagues_by_shift_id,get_shift_colleagues_by_user_id,get_shift_colleagues_by_action
from typing import List

router = APIRouter()
app = FastAPI()

# Configurer le logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



@router.post("/invite_colleague", response_model=ShiftColleagueResponse)
async def invite_colleague_endpoint(invite: InviteColleague, db: Session = Depends(get_db)):
    """
    Invite un collègue à un shift.
    """
      # Créer une nouvelle invitation
    new_invite = await invite_colleague(db, invite)
    return new_invite

@router.put("/action_invitation", response_model=ShiftColleagueResponse)
async def action_invitation_endpoint(invite: ActionInvitation, db: Session = Depends(get_db)):
    """"
    "Récupère un shifts par son status.
    """
    shifts = await action_invitation(db, invite)
    return shifts
  
@router.get("/get_all_shifts_colleagues_by_shift_id/{shift_id}", response_model=List[ShiftColleagueResponse])
async def get_all_shifts_colleagues_by_shift_id_endpoint(shift_id: str, db: Session = Depends(get_db)):
    """
    Récupère tous les shifts_collegues d'un shift id .
    """
    shifts = await get_shift_colleagues_by_shift_id(db, shift_id)
    return shifts

@router.get("/get_all_shifts_colleagues_by_user_id/{user_id}", response_model=List[ShiftColleagueResponse])
async def get_all_shifts_colleagues_by_user_id_endpoint(user_id: str, db: Session = Depends(get_db)):
    """
    Récupère tous les shifts_collegues d'un user id .
    """
    shifts = await get_shift_colleagues_by_user_id(db, user_id)
    return shifts

@router.get("/get_all_shifts_colleagues_by_action/{action}", response_model=List[ShiftColleagueResponse])
async def get_all_shifts_colleagues_by_action_endpoint(action: str, db: Session = Depends(get_db)):
    """
    Récupère tous les shifts_collegues d'un user id .
    """
    shifts = await get_shift_colleagues_by_action(db, action)
    return shifts

