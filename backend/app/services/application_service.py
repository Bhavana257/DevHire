from sqlalchemy.orm import Session
from app.models.application import Application, ApplicationStatus
from app.models.job import Job
from app.schemas.application import ApplicationCreate, ApplicationStatusUpdate
from fastapi import HTTPException


def apply_to_job(db: Session, application_data: ApplicationCreate, candidate_id: int):
    job = db.query(Job).filter(Job.id == application_data.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if not job.is_active:
        raise HTTPException(status_code=400, detail="Job is no longer active")

    existing = db.query(Application).filter(
        Application.job_id == application_data.job_id,
        Application.candidate_id == candidate_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job")

    new_application = Application(
        job_id=application_data.job_id,
        candidate_id=candidate_id,
        cover_letter=application_data.cover_letter
    )
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return new_application


def get_my_applications(db: Session, candidate_id: int):
    return db.query(Application).filter(
        Application.candidate_id == candidate_id
    ).all()


def get_job_applicants(db: Session, job_id: int, employer_id: int):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.employer_id != employer_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(Application).filter(Application.job_id == job_id).all()


def update_application_status(db: Session, application_id: int, status_data: ApplicationStatusUpdate, employer_id: int):
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    job = db.query(Job).filter(Job.id == application.job_id).first()
    if job.employer_id != employer_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    application.status = status_data.status
    db.commit()
    db.refresh(application)
    return application
