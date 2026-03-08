from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class JobType(str, Enum):
    full_time = "full_time"
    part_time = "part_time"
    contract = "contract"
    internship = "internship"


class ExperienceLevel(str, Enum):
    junior = "junior"
    mid = "mid"
    senior = "senior"


class JobCreate(BaseModel):
    title: str
    description: str
    company_name: str
    location: str
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    job_type: JobType = JobType.full_time
    experience_level: ExperienceLevel = ExperienceLevel.mid
    skills_required: Optional[str] = None


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    job_type: Optional[JobType] = None
    experience_level: Optional[ExperienceLevel] = None
    skills_required: Optional[str] = None
    is_active: Optional[bool] = None


class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    company_name: str
    location: str
    salary_min: Optional[int]
    salary_max: Optional[int]
    job_type: JobType
    experience_level: ExperienceLevel
    skills_required: Optional[str]
    is_active: bool
    employer_id: int
    created_at: datetime

    class Config:
        from_attributes = True
