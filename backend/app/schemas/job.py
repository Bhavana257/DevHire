from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class JobCreate(BaseModel):
    title: str
    description: str
    company_name: str
    location: str
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    job_type: str = "full_time"
    experience_level: str = "mid"
    category: str = "software"
    skills_required: Optional[str] = None


class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    company_name: str
    location: str
    salary_min: Optional[int]
    salary_max: Optional[int]
    job_type: str
    experience_level: str
    category: str
    skills_required: Optional[str]
    is_active: bool
    employer_id: int
    created_at: datetime

    class Config:
        from_attributes = True
