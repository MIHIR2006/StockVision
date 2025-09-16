from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from pydantic import EmailStr
import secrets
import os
import smtplib
from email.mime.text import MIMEText
from passlib.context import CryptContext

from app.db import get_db
from app.user_models import UserDB
from app.models import ForgotPasswordRequest, ResetPasswordRequest

router = APIRouter(prefix="/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Signup (for testing/demo)
@router.post("/signup")
def signup(email: EmailStr, password: str, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.email == email).first()
    if user:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed = pwd_context.hash(password)
    new_user = UserDB(email=email, hashed_password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

# Forgot password
@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.email == payload.email).first()
    generic_response = {"message": "If an account with that email exists, a reset link has been sent."}
    if not user:
        return generic_response

    token = secrets.token_urlsafe(32)
    expiry = datetime.utcnow() + timedelta(minutes=15)
    user.reset_token = token
    user.reset_token_expiry = expiry
    db.add(user)
    db.commit()

    reset_link = f"{os.getenv('FRONTEND_URL', 'https://stock-vision-seven.vercel.app')}/reset-password/{token}"

    msg = MIMEText(f"Click to reset your password: {reset_link}")
    msg["Subject"] = "StockVision Password Reset"
    msg["From"] = os.getenv("EMAIL_USER")
    msg["To"] = user.email

    try:
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", 587))
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
            server.send_message(msg)
    except smtplib.SMTPException as e:
        # TODO: Log the error `e` for debugging purposes.
        raise HTTPException(status_code=500, detail="Could not send email. Please try again later.")

    return generic_response

# Reset password
@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.reset_token == payload.token).first()
    if not user or not user.reset_token_expiry or user.reset_token_expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    user.hashed_password = pwd_context.hash(payload.new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.add(user)
    db.commit()
    return {"message": "Password has been reset successfully"}
