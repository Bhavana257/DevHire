from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class ApplicationStatus(str, Enum):
    applied = "applied"
    shortlisted = "shortlisted"
    rejected = "rejected"
    hired = "hired"


class ApplicationCreate(BaseModel):
    job_id: int
    cover_letter: Optional[str] = None


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    candidate_id: int
    status: ApplicationStatus
    cover_letter: Optional[str]
    resume_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
