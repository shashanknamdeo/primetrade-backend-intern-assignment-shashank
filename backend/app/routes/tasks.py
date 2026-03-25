from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, Task as TaskSchema
from app.utils.dependencies import get_current_active_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[TaskSchema])
def read_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    # Users only see their own tasks
    tasks = db.query(Task).filter(Task.owner_id == current_user.id).offset(skip).limit(limit).all()
    return tasks

@router.post("/", response_model=TaskSchema)
def create_task(
    *,
    db: Session = Depends(get_db),
    task_in: TaskCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    task = Task(**task_in.model_dump(), owner_id=current_user.id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.put("/{id}", response_model=TaskSchema)
def update_task(
    *,
    db: Session = Depends(get_db),
    id: int,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    task = db.query(Task).filter(Task.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    update_data = task_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{id}", response_model=TaskSchema)
def delete_task(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    task = db.query(Task).filter(Task.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(task)
    db.commit()
    return task
