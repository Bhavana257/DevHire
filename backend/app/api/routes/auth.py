from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.services.auth_service import register_user, login_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session=Depends(get_db)):
    return register_user(db, user_data)


@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session=Depends(get_db)):
    return login_user(db, user_data.email, user_data.password)


from app.core.dependencies import get_current_user


@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return current_user
