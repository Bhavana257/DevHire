from pydantic import BaseModel
from typing import Optional


class CandidateProfileCreate(BaseModel):
    bio: Optional[str] = None
    skills: Optional[str] = None
    experience_years: Optional[int] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None


class CandidateProfileResponse(BaseModel):
    id: int
    user_id: int
    bio: Optional[str]
    skills: Optional[str]
    experience_years: Optional[int]
    github_url: Optional[str]
    linkedin_url: Optional[str]
    portfolio_url: Optional[str]
    resume_url: Optional[str]

    class Config:
        from_attributes = True


class EmployerProfileCreate(BaseModel):
    company_name: str
    company_description: Optional[str] = None
    company_website: Optional[str] = None
    company_size: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None


class EmployerProfileResponse(BaseModel):
    id: int
    user_id: int
    company_name: str
    company_description: Optional[str]
    company_website: Optional[str]
    company_size: Optional[str]
    industry: Optional[str]
    location: Optional[str]

    class Config:
        from_attributes = True
