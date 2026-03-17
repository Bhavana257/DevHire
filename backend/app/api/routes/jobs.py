from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.schemas.job import JobCreate, JobUpdate, JobResponse
from app.services.job_service import create_job, get_all_jobs, get_job_by_id, update_job, delete_job
from app.core.dependencies import get_current_user, get_current_employer

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/", response_model=JobResponse)
def post_job(job_data: JobCreate, db: Session=Depends(get_db), current_user=Depends(get_current_employer)):
    return create_job(db, job_data, current_user.id)


@router.get("/", response_model=List[JobResponse])
def list_jobs(
    skip: int=0,
    limit: int=50,
    search: Optional[str]=Query(None),
    location: Optional[str]=Query(None),
    category: Optional[str]=Query(None),
    db: Session=Depends(get_db)
):
    return get_all_jobs(db, skip, limit, search, location, category)


@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session=Depends(get_db)):
    return get_job_by_id(db, job_id)


@router.put("/{job_id}", response_model=JobResponse)
def edit_job(job_id: int, job_data: JobUpdate, db: Session=Depends(get_db), current_user=Depends(get_current_employer)):
    return update_job(db, job_id, job_data, current_user.id)


@router.delete("/{job_id}")
def remove_job(job_id: int, db: Session=Depends(get_db), current_user=Depends(get_current_employer)):
    return delete_job(db, job_id, current_user.id)
