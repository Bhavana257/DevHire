from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    bio = Column(String, nullable=True)
    skills = Column(String, nullable=True)
    experience_years = Column(Integer, nullable=True)
    github_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    resume_url = Column(String, nullable=True)

    user = relationship("User", backref="profile")


class EmployerProfile(Base):
    __tablename__ = "employer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    company_name = Column(String, nullable=False)
    company_description = Column(String, nullable=True)
    company_website = Column(String, nullable=True)
    company_size = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    location = Column(String, nullable=True)

    user = relationship("User", backref="employer_profile")
