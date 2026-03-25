from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.task import TaskStatus

class TaskBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = TaskStatus.PENDING

class TaskCreate(TaskBase):
    title: str = Field(..., min_length=3, max_length=100)

class TaskUpdate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)
