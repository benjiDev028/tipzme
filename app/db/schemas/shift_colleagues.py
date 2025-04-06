from pydantic import BaseModel, Field
from datetime import datetime,time,date as Date
from uuid import UUID


class ShiftColleaguesBase(BaseModel):
    """Base model for ShiftColleagues"""
    id: UUID = Field(..., alias="id")
    shift_id: UUID = Field(..., alias="shift_id")
    user_id: UUID = Field(..., alias="user_id")
    name: str = Field(..., alias="name")
    status: str = Field(..., alias="status")
    date_modified: datetime = Field(..., alias="date_modified")
    
   
class ShiftColleaguesCreate(ShiftColleaguesBase):
    """Model for creating a new Shift"""
    pass

class InviteColleague(BaseModel):
    shift_id: UUID
    user_id: UUID
   


class ActionInvitation(BaseModel):
    """Model for creating a new ActionInvitation"""
    shift_id: UUID
    user_id: UUID
    action: str


class ShiftColleagueResponse(BaseModel):
    id: UUID
    shift_id: UUID
    user_id: UUID
    status: str
    date_modified: datetime

    class Config:
        from_attributes = True  
    @classmethod
    def from_orm(cls, obj):
        return cls(
            id=str(obj.id),
            shift_id=str(obj.shift_id),
            user_id=str(obj.user_id),
            status=obj.status,
            date_modified=obj.date_modified.strftime("%Y-%m-%d %H:%M:%S"),
        )