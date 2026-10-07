patients = [
    {
        "id": "TC1024",
        "name": "Maya Rao",
        "age": 54,
        "gender": "Female",
        "condition": "Type 2 Diabetes",
        "risk_level": "Moderate",
        "twin_status": "Active",
        "prediction": "Elevated glucose spike risk",
    },
    {
        "id": "TC1091",
        "name": "Arjun Mehta",
        "age": 61,
        "gender": "Male",
        "condition": "Hypertension",
        "risk_level": "High",
        "twin_status": "Active",
        "prediction": "Cardiovascular strain",
    },
    {
        "id": "TC1117",
        "name": "Leela Nair",
        "age": 43,
        "gender": "Female",
        "condition": "Prediabetes",
        "risk_level": "Low",
        "twin_status": "Stable",
        "prediction": "Stable pattern",
    },
]

alerts = [
    {
        "patient": "Maya Rao",
        "patient_id": "TC1024",
        "type": "Glucose risk",
        "risk": "Warning",
        "message": "Elevated glucose risk detected",
        "timestamp": "2026-10-07T14:20:00",
        "status": "Open",
    },
    {
        "patient": "Arjun Mehta",
        "patient_id": "TC1091",
        "type": "Cardiovascular",
        "risk": "Critical",
        "message": "Abnormal heart-rate pattern",
        "timestamp": "2026-10-07T13:45:00",
        "status": "Open",
    },
]

reports = [
    {
        "patient_id": "TC1024",
        "status": "Ready",
        "summary": "Patient risk summary is ready for clinician review.",
        "confidence": 0.87,
    }
]
