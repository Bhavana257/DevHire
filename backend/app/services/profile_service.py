from sqlalchemy.orm import Session
from app.models.profile import CandidateProfile, EmployerProfile
from app.models.saved_job import SavedJob
from app.schemas.profile import CandidateProfileCreate, EmployerProfileCreate
from fastapi import HTTPException


def get_or_create_candidate_profile(db: Session, user_id: int, data: CandidateProfileCreate):
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == user_id).first()
    if profile:
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(profile, key, value)
    else:
        profile = CandidateProfile(**data.model_dump(), user_id=user_id)
        db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def get_candidate_profile(db: Session, user_id: int):
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


def get_or_create_employer_profile(db: Session, user_id: int, data: EmployerProfileCreate):
    profile = db.query(EmployerProfile).filter(EmployerProfile.user_id == user_id).first()
    if profile:
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(profile, key, value)
    else:
        profile = EmployerProfile(**data.model_dump(), user_id=user_id)
        db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def save_job(db: Session, user_id: int, job_id: int):
    existing = db.query(SavedJob).filter(
        SavedJob.user_id == user_id,
        SavedJob.job_id == job_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Job already saved")
    saved = SavedJob(user_id=user_id, job_id=job_id)
    db.add(saved)
    db.commit()
    return {"message": "Job saved successfully"}


def get_saved_jobs(db: Session, user_id: int):
    return db.query(SavedJob).filter(SavedJob.user_id == user_id).all()


def unsave_job(db: Session, user_id: int, job_id: int):
    saved = db.query(SavedJob).filter(
        SavedJob.user_id == user_id,
        SavedJob.job_id == job_id
    ).first()
    if not saved:
        raise HTTPException(status_code=404, detail="Saved job not found")
    db.delete(saved)
    db.commit()
    return {"message": "Job removed from saved"}
