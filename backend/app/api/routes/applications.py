from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.application import Application
from app.models.job import Job
from app.schemas.application import ApplicationCreate
from app.services.application_service import create_application, get_my_applications, get_job_applications

router = APIRouter()


@router.post("/")
def apply(app_data: ApplicationCreate, db: Session=Depends(get_db), current_user: User=Depends(get_current_user)):
    if current_user.role != 'candidate':
        raise HTTPException(status_code=403, detail="Only candidates can apply")
    return create_application(db, app_data, current_user.id)


@router.get("/my")
def my_applications(db: Session=Depends(get_db), current_user: User=Depends(get_current_user)):
    return get_my_applications(db, current_user.id)


@router.get("/job/{job_id}")
def job_applications(job_id: int, db: Session=Depends(get_db), current_user: User=Depends(get_current_user)):
    return get_job_applications(db, job_id)


@router.put("/{app_id}/status")
def update_status(app_id: int, status: str, db: Session=Depends(get_db), current_user: User=Depends(get_current_user)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = status
    db.commit()
    db.refresh(app)
    return app


@router.put("/{app_id}/resume")
def upload_resume_url(app_id: int, resume_url: str, db: Session=Depends(get_db), current_user: User=Depends(get_current_user)):
    app = db.query(Application).filter(Application.id == app_id, Application.candidate_id == current_user.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.resume_url = resume_url
    db.commit()
    db.refresh(app)
    return app


@router.post("/ats-scan")
def ats_scan(job_id: int, resume_text: str, db: Session=Depends(get_db), current_user: User=Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job_keywords = set()
    if job.skills_required:
        job_keywords.update([s.strip().lower() for s in job.skills_required.split(',')])
    if job.description:
        common_tech = ['python', 'javascript', 'react', 'node', 'sql', 'aws', 'docker', 'git',
                       'java', 'typescript', 'mongodb', 'postgresql', 'redis', 'fastapi', 'django']
        for tech in common_tech:
            if tech in job.description.lower():
                job_keywords.add(tech)

    resume_lower = resume_text.lower()
    matched = [kw for kw in job_keywords if kw in resume_lower]
    missing = [kw for kw in job_keywords if kw not in resume_lower]

    score = int((len(matched) / len(job_keywords)) * 100) if job_keywords else 0

    return {
        "score": score,
        "matched_keywords": matched,
        "missing_keywords": missing,
        "total_keywords": len(job_keywords),
        "recommendation": "Strong match! 🎉" if score >= 70 else "Good match with some gaps 📝" if score >= 40 else "Needs improvement ⚠️"
    }
