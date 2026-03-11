from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.job import Job

router = APIRouter()


def require_admin(current_user: User=Depends(get_current_user)):
    if current_user.role != 'admin':
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.get("/users")
def get_all_users(db: Session=Depends(get_db), admin=Depends(require_admin)):
    return db.query(User).all()


@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session=Depends(get_db), admin=Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}


@router.get("/jobs")
def get_all_jobs(db: Session=Depends(get_db), admin=Depends(require_admin)):
    return db.query(Job).all()


@router.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session=Depends(get_db), admin=Depends(require_admin)):
    job = db.query(Job).filter(Job.id == job_id).first()
    db.delete(job)
    db.commit()
    return {"message": "Job deleted"}
