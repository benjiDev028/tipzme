from pydantic import BaseModel, Field
from datetime import datetime,time,date as Date
from uuid import UUID



class ShiftBase(BaseModel):
    """Base model for Shift, defines the common attributes"""
    # id: UUID = Field(..., alias="id", description="Unique identifier for the shift")
    creator_id: UUID = Field(..., alias="creator_id", description="Unique identifier for the user")
    name_shift: str = Field(..., alias="name_shift", description="Name of the shift")
    date: Date = Field(..., alias="date", description="Date of the shift")
    start_time: time = Field(..., alias="start_time", description="Start time of the shift")
    end_time: time = Field(..., alias="end_time", description="End time of the shift")
    status: str = Field(..., alias="status", description="Status of the shift")
    created_at: datetime = Field(..., alias="created_at", description="Creation time of the shift")
    updated_at: datetime = Field(..., alias="updated_at", description="Last update time of the shift")

class ShiftCreate(BaseModel):
    """Model for creating a new Shift"""
    creator_id: UUID 
    name_shift: str 
    date: Date 
    start_time: time
    end_time: time 



    

class ShiftUpdate(BaseModel):
    """Model for updating an existing Shift"""
    name_shift: str
    date: str
    start_time: str
    end_time: str
    

class ShiftStatusFind(BaseModel):
    status:str
    
class ShiftResponse(BaseModel):
    id: str
    creator_id: str
    name_shift: str
    date: str
    start_time: str
    end_time: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True  
    @classmethod
    def from_orm(cls, obj):
        return cls(
            id=str(obj.id),
            creator_id=str(obj.creator_id),
            name_shift=obj.name_shift,
            date=obj.date.strftime("%Y-%m-%d"),  # AAAA-MM-JJ
            start_time=obj.start_time.strftime("%H-%M"),  # HH-MM (corrigé, pas HH-SS)
            end_time=obj.end_time.strftime("%H-%M"),
            created_at=obj.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            updated_at=obj.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
        )