from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base
import enum


class JobType(str, enum.Enum):
    full_time = "full_time"
    part_time = "part_time"
    contract = "contract"
    internship = "internship"


class ExperienceLevel(str, enum.Enum):
    junior = "junior"
    mid = "mid"
    senior = "senior"


class JobCategory(str, enum.Enum):
    software = "software"
    data = "data"
    devops = "devops"
    design = "design"
    mobile = "mobile"
    security = "security"
    management = "management"
    other = "other"


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)
    job_type = Column(Enum(JobType), default=JobType.full_time)
    experience_level = Column(Enum(ExperienceLevel), default=ExperienceLevel.mid)
    category = Column(Enum(JobCategory), default=JobCategory.software)
    skills_required = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    employer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    employer = relationship("User", backref="jobs")
