from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.job import Job
from app.schemas.job import JobCreate, JobUpdate
from fastapi import HTTPException, status


def create_job(db: Session, job_data: JobCreate, employer_id: int):
    new_job = Job(**job_data.model_dump(), employer_id=employer_id)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job


def get_all_jobs(db: Session, skip: int=0, limit: int=10, search: str=None, location: str=None):
    query = db.query(Job).filter(Job.is_active == True)
    if search:
        query = query.filter(
            or_(Job.title.ilike(f"%{search}%"),
                Job.skills_required.ilike(f"%{search}%"))
        )
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    return query.offset(skip).limit(limit).all()


def get_job_by_id(db: Session, job_id: int):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


def update_job(db: Session, job_id: int, job_data: JobUpdate, employer_id: int):
    job = get_job_by_id(db, job_id)
    if job.employer_id != employer_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    for key, value in job_data.model_dump(exclude_unset=True).items():
        setattr(job, key, value)
    db.commit()
    db.refresh(job)
    return job


def delete_job(db: Session, job_id: int, employer_id: int):
    job = get_job_by_id(db, job_id)
    if job.employer_id != employer_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(job)
    db.commit()
    return {"message": "Job deleted successfully"}
