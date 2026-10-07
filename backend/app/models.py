from pydantic import BaseModel


class PredictInput(BaseModel):
    glucose: float
    heart_rate: float
    hrv: float
    sleep: float
    steps: float
    activity: float
    hba1c: float
    blood_pressure: float


class PredictOutput(BaseModel):
    risk_level: str
    prediction: str
    confidence: float
    contributing_factors: list[str]


class HealthRecord(BaseModel):
    patient_id: str
    diagnosis: str
    hba1c: float
    blood_pressure: float
    cholesterol: float
    glucose: float
    medical_history: str
