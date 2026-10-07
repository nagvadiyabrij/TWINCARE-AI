from __future__ import annotations

import hashlib
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

import jwt
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text, create_engine
from sqlalchemy.orm import Session, declarative_base, relationship, sessionmaker

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATABASE_DIR = PROJECT_ROOT / "database"
DATABASE_DIR.mkdir(exist_ok=True)
DB_PATH = DATABASE_DIR / "twincare.db"
DATABASE_URL = f"sqlite:///{DB_PATH.as_posix()}"

Base = declarative_base()


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def create_token(user_id: int) -> str:
    payload = {"sub": str(user_id), "exp": datetime.utcnow() + timedelta(hours=8)}
    return jwt.encode(payload, os.getenv("JWT_SECRET", "twincare-secret-key"), algorithm="HS256")


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(40), default="DOCTOR")
    status = Column(String(40), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    patients = relationship("Patient", back_populates="doctor")


class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    patient_code = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(120), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    diagnosis = Column(String(200), nullable=False)
    risk_level = Column(String(30), default="Moderate")
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    doctor = relationship("User", back_populates="patients")
    digital_twins = relationship("DigitalTwin", back_populates="patient")
    alerts = relationship("Alert", back_populates="patient")
    predictions = relationship("Prediction", back_populates="patient")


class DigitalTwin(Base):
    __tablename__ = "digital_twins"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    twin_code = Column(String(60), nullable=False)
    twin_status = Column(String(40), default="ACTIVE")
    overall_risk = Column(String(30), default="Moderate")
    last_sync = Column(String(50), default="2 min ago")
    model_version = Column(String(40), default="v2.4")
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="digital_twins")


class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    alert_type = Column(String(80), default="General")
    severity = Column(String(30), default="Warning")
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(30), default="Open")
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="alerts")


class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    prediction_type = Column(String(80), default="Glucose Risk")
    prediction = Column(Text, nullable=False)
    risk_level = Column(String(30), default="Moderate")
    confidence = Column(Float, default=0.0)
    prediction_horizon = Column(String(30), default="2 hours")
    model_version = Column(String(40), default="v2.4")
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="predictions")


engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
security = HTTPBearer(auto_error=False)
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    if not credentials:
        raise HTTPException(status_code=401, detail="Missing authentication token")
    try:
        payload = jwt.decode(credentials.credentials, os.getenv("JWT_SECRET", "twincare-secret-key"), algorithms=["HS256"])
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid token") from exc
    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


def require_roles(*roles: str):
    def guard(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Permission denied")
        return user

    return guard


def seed_data(db: Session) -> None:
    if db.query(User).count() > 0:
        return

    admin = User(name="System Admin", email="admin@twincare.ai", password_hash=hash_password("Admin@123"), role="ADMIN", status="ACTIVE")
    doctor = User(name="Dr. Sharma", email="doctor@twincare.ai", password_hash=hash_password("Demo@123"), role="DOCTOR", status="ACTIVE")
    db.add_all([admin, doctor])
    db.commit()

    patient1 = Patient(patient_code="TC1024", name="Maya Rao", age=54, gender="Female", diagnosis="Type 2 Diabetes", risk_level="Moderate", doctor_id=doctor.id)
    patient2 = Patient(patient_code="TC1091", name="Arjun Mehta", age=61, gender="Male", diagnosis="Hypertension", risk_level="High", doctor_id=doctor.id)
    db.add_all([patient1, patient2])
    db.commit()

    db.add_all([
        DigitalTwin(patient_id=patient1.id, twin_code="TW-TC1024", twin_status="ACTIVE", overall_risk="Moderate", last_sync="2 min ago", model_version="v2.4"),
        DigitalTwin(patient_id=patient2.id, twin_code="TW-TC1091", twin_status="ACTIVE", overall_risk="High", last_sync="5 min ago", model_version="v2.4"),
        Alert(patient_id=patient1.id, alert_type="Glucose Spike", severity="Warning", title="Elevated glucose risk", description="Synthetic alert for patient TC1024."),
        Alert(patient_id=patient2.id, alert_type="Cardiovascular", severity="Critical", title="Abnormal heart-rate pattern", description="Synthetic alert for patient TC1091."),
        Prediction(patient_id=patient1.id, prediction_type="Glucose Risk", prediction="Elevated glucose risk", risk_level="Moderate", confidence=0.87, prediction_horizon="2 hours", model_version="v2.4"),
        Prediction(patient_id=patient2.id, prediction_type="Cardiovascular Risk", prediction="Cardiovascular risk trend rising", risk_level="High", confidence=0.91, prediction_horizon="1 hour", model_version="v2.4"),
    ])
    db.commit()


with SessionLocal() as session:
    seed_data(session)

app = FastAPI(title="TwinCare AI")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


@app.get("/api/health")
def health() -> dict[str, Any]:
    return {"status": "ok", "service": "TwinCare AI backend"}


@app.post("/api/auth/login")
def login(payload: dict[str, str], db: Session = Depends(get_db)):
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""
    user = db.query(User).filter(User.email == email).first()
    if not user or user.password_hash != hash_password(password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user.last_login = datetime.utcnow()
    db.commit()
    return {
        "token": create_token(user.id),
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role, "status": user.status},
    }


@app.get("/api/me")
def me(user: User = Depends(get_current_user)):
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role, "status": user.status}


@app.get("/api/admin/overview")
def admin_overview(db: Session = Depends(get_db), user: User = Depends(require_roles("ADMIN"))):
    return {
        "total_users": db.query(User).count(),
        "total_doctors": db.query(User).filter(User.role == "DOCTOR").count(),
        "total_patients": db.query(Patient).count(),
        "active_digital_twins": db.query(DigitalTwin).filter(DigitalTwin.twin_status == "ACTIVE").count(),
        "high_risk_patients": db.query(Patient).filter(Patient.risk_level == "High").count(),
        "predictions_generated": db.query(Prediction).count(),
        "active_alerts": db.query(Alert).filter(Alert.status == "Open").count(),
        "system_health": "Stable",
    }


@app.get("/api/users")
def list_users(db: Session = Depends(get_db), user: User = Depends(require_roles("ADMIN"))):
    return [{"id": item.id, "name": item.name, "email": item.email, "role": item.role, "status": item.status} for item in db.query(User).all()]


@app.get("/api/patients")
def list_patients(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    query = db.query(Patient)
    if user.role == "DOCTOR":
        query = query.filter(Patient.doctor_id == user.id)
    return [{"id": item.id, "patient_code": item.patient_code, "name": item.name, "age": item.age, "gender": item.gender, "diagnosis": item.diagnosis, "risk_level": item.risk_level, "doctor_id": item.doctor_id} for item in query.all()]


@app.get("/api/digital-twins")
def digital_twins(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return [{"id": item.id, "patient_name": item.patient.name, "twin_code": item.twin_code, "twin_status": item.twin_status, "overall_risk": item.overall_risk, "last_sync": item.last_sync, "model_version": item.model_version} for item in db.query(DigitalTwin).all()]


@app.get("/api/alerts")
def alerts(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return [{"id": item.id, "patient": item.patient.name, "title": item.title, "alert_type": item.alert_type, "severity": item.severity, "status": item.status, "description": item.description} for item in db.query(Alert).all()]


@app.get("/api/reports")
def reports(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return [{"id": item.id, "patient_id": item.patient_id, "prediction": item.prediction, "risk_level": item.risk_level, "created_at": item.created_at.isoformat()} for item in db.query(Prediction).all()]


@app.get("/api/settings")
def settings(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return [{"setting_name": "application_name", "setting_value": "TwinCare AI"}, {"setting_name": "alert_threshold", "setting_value": "Moderate"}]


@app.post("/api/predict")
def predict(payload: dict[str, Any], db: Session = Depends(get_db)):
    glucose = float(payload.get("glucose", 0) or 0)
    heart_rate = float(payload.get("heart_rate", 0) or 0)
    hrv = float(payload.get("hrv", 0) or 0)
    sleep = float(payload.get("sleep", 0) or 0)
    steps = float(payload.get("steps", 0) or 0)
    activity = str(payload.get("activity", "low")).lower()
    hba1c = float(payload.get("hba1c", 0) or 0)
    score = 0.0
    factors: list[str] = []
    if glucose > 140: score += 0.35; factors.append("Elevated glucose")
    if sleep < 6.5: score += 0.2; factors.append("Reduced sleep")
    if activity in {"low", "sedentary"}: score += 0.15; factors.append("Low activity")
    if hrv < 40: score += 0.15; factors.append("HRV variation")
    if hba1c > 6.8: score += 0.18; factors.append("HbA1c elevation")
    if steps < 5000: score += 0.1; factors.append("Lower movement")
    if heart_rate > 85: score += 0.1; factors.append("Elevated heart rate")
    risk_level = "Moderate" if score >= 0.5 else "Low"
    prediction = "Elevated glucose risk" if score >= 0.5 else "Stable trend within expected range"
    result = {
        "risk_level": risk_level,
        "prediction": prediction,
        "confidence": round(min(0.97, 0.58 + (score * 0.6)), 2),
        "prediction_horizon": "2 hours",
        "contributing_factors": factors[:4] if factors else ["Stable baseline pattern"],
    }
    db.add(Prediction(patient_id=1, prediction_type="Glucose Risk", prediction=result["prediction"], risk_level=result["risk_level"], confidence=result["confidence"], prediction_horizon=result["prediction_horizon"], model_version="v2.4"))
    db.commit()
    return result
