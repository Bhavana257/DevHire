from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.application import ApplicationCreate, ApplicationStatusUpdate, ApplicationResponse
from app.services.application_service import (
    apply_to_job, get_my_applications,
    get_job_applicants, update_application_status
)
from app.core.dependencies import get_current_user, get_current_employer, get_current_candidate

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.post("/", response_model=ApplicationResponse)
def apply(
    application_data: ApplicationCreate,
    db: Session=Depends(get_db),
    current_user=Depends(get_current_candidate)
):
    return apply_to_job(db, application_data, current_user.id)


@router.get("/my", response_model=List[ApplicationResponse])
def my_applications(
    db: Session=Depends(get_db),
    current_user=Depends(get_current_candidate)
):
    return get_my_applications(db, current_user.id)


@router.get("/job/{job_id}", response_model=List[ApplicationResponse])
def job_applicants(
    job_id: int,
    db: Session=Depends(get_db),
    current_user=Depends(get_current_employer)
):
    return get_job_applicants(db, job_id, current_user.id)


@router.put("/{application_id}/status", response_model=ApplicationResponse)
def update_status(
    application_id: int,
    status_data: ApplicationStatusUpdate,
    db: Session=Depends(get_db),
    current_user=Depends(get_current_employer)
):
    return update_application_status(db, application_id, status_data, current_user.id)
