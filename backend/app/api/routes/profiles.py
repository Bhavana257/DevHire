from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.profile import (
    CandidateProfileCreate, CandidateProfileResponse,
    EmployerProfileCreate, EmployerProfileResponse
)
from app.services.profile_service import (
    get_or_create_candidate_profile, get_candidate_profile,
    get_or_create_employer_profile, save_job, get_saved_jobs, unsave_job
)
from app.core.dependencies import get_current_user, get_current_candidate, get_current_employer

router = APIRouter(prefix="/profiles", tags=["Profiles"])


@router.post("/candidate", response_model=CandidateProfileResponse)
def upsert_candidate_profile(
    data: CandidateProfileCreate,
    db: Session=Depends(get_db),
    current_user=Depends(get_current_candidate)
):
    return get_or_create_candidate_profile(db, current_user.id, data)


@router.get("/candidate/{user_id}", response_model=CandidateProfileResponse)
def get_profile(user_id: int, db: Session=Depends(get_db)):
    return get_candidate_profile(db, user_id)


@router.post("/employer", response_model=EmployerProfileResponse)
def upsert_employer_profile(
    data: EmployerProfileCreate,
    db: Session=Depends(get_db),
    current_user=Depends(get_current_employer)
):
    return get_or_create_employer_profile(db, current_user.id, data)


@router.post("/saved-jobs/{job_id}")
def save(job_id: int, db: Session=Depends(get_db), current_user=Depends(get_current_user)):
    return save_job(db, current_user.id, job_id)


@router.get("/saved-jobs")
def saved(db: Session=Depends(get_db), current_user=Depends(get_current_user)):
    return get_saved_jobs(db, current_user.id)


@router.delete("/saved-jobs/{job_id}")
def unsave(job_id: int, db: Session=Depends(get_db), current_user=Depends(get_current_user)):
    return unsave_job(db, current_user.id, job_id)
