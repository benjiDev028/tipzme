import logging
from sqlalchemy.orm import Session
from app.db.models.shift import Shift
from fastapi import HTTPException
from app.db.schemas.shift_colleagues import InviteColleague, ShiftColleagueResponse, ActionInvitation
from app.db.models.shift import Shift
from app.db.models.shift_colleagues import ShiftColleague
from datetime  import datetime
import uuid
from typing import List



# Configuration du logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
        logging.FileHandler("shiftColleagues_logs.log"),  # Nom du fichier de log
        logging.StreamHandler()  # Envoie également les logs à la console
    ])


async def  invite_colleague(db: Session, invite:InviteColleague) -> ShiftColleagueResponse:


    #verifier si le shift existe
    shift = db.query(Shift).filter(Shift.id == invite.shift_id).first()
    if not shift:
        logging.error(f"Shift with ID {invite.shift_id} not found")
        raise HTTPException(status_code=404, detail="Shift not found")
    
    #verifier si l'invitation existe
    existing_invite = db.query(ShiftColleague).join(Shift, ShiftColleague.shift_id == Shift.id).filter(
    ShiftColleague.shift_id == invite.shift_id, 
    ShiftColleague.user_id == invite.user_id
).first()
    if existing_invite:
        logging.error(f"Invitation with ID {invite.shift_id} already exists")
        raise HTTPException(status_code=400, detail="Invitation already exists")
    
    # Create a new invitation
    new_invite = ShiftColleague(shift_id=invite.shift_id, user_id=invite.user_id,status="pending", date_modified=datetime.now())
    db.add(new_invite)
    db.commit()
    db.refresh(new_invite)
    
    return ShiftColleagueResponse.from_orm(new_invite)

async def action_invitation(db:Session, invite:ActionInvitation):
    #verifier si l'invitation existe
    existing_invite = db.query(ShiftColleague).filter(
        ShiftColleague.shift_id == invite.shift_id, 
        ShiftColleague.user_id == invite.user_id
    ).first()
    if not existing_invite:
        logging.error(f"Invitation with ID {invite.shift_id} not found")
        raise HTTPException(status_code=404, detail="Invitation not found")
    
    if existing_invite.status == "pending":
    
        if invite.action == "accepted":
            existing_invite.status = "accepted"
        elif invite.action == "refused":
            existing_invite.status = "refused"
        else:
            raise HTTPException(status_code=400, detail="Action non valide.")
        
        db.commit()
        db.refresh(existing_invite)
    
        return ShiftColleagueResponse(
            id=existing_invite.id,
            shift_id=existing_invite.shift_id,
            user_id=existing_invite.user_id,
            status=existing_invite.status,
            date_modified=existing_invite.date_modified
        )
    else:
        raise HTTPException(status_code=400, detail="Invitation already accepted or refused")

async def get_shift_colleagues_by_shift_id(db: Session, shift_id: uuid) -> List[ShiftColleagueResponse]:

    """Récupère les invitations pour un shift donné."""
    shift_colleagues = db.query(ShiftColleague).join(Shift, ShiftColleague.shift_id == Shift.id).filter(ShiftColleague.shift_id == shift_id).all()
    if not shift_colleagues:
        logging.error(f"No invitations found for shift with ID {shift_id}")
        raise HTTPException(status_code=404, detail="No invitations found")
    return [ShiftColleagueResponse.from_orm(shift_colleague) for shift_colleague in shift_colleagues]

async def get_shift_colleagues_by_user_id(db: Session, user_id: uuid) -> List[ShiftColleagueResponse]:
    """Récupère les invitations pour un utilisateur donné."""
    shift_colleagues = db.query(ShiftColleague).join(Shift, ShiftColleague.shift_id == Shift.id).filter(ShiftColleague.user_id == user_id).all()
    if not shift_colleagues:
        logging.error(f"No invitations found for user with ID {user_id}")
        raise HTTPException(status_code=404, detail="No invitations found")
    return [ShiftColleagueResponse.from_orm(shift_colleague) for shift_colleague in shift_colleagues]



async def get_shift_colleagues_by_action (db: Session, action: str) -> List[ShiftColleagueResponse]:
    """Récupère les invitations pour un utilisateur donné."""
    shift_colleagues = db.query(ShiftColleague).join(Shift, ShiftColleague.shift_id == Shift.id).filter(ShiftColleague.status == action).all()
    if not shift_colleagues:
        logging.error(f"No invitations found for user with ID {action}")
        raise HTTPException(status_code=404, detail="No invitations found")
    return [ShiftColleagueResponse.from_orm(shift_colleague) for shift_colleague in shift_colleagues]

