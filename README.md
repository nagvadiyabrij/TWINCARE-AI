# TwinCare AI

TwinCare AI is a full-stack healthcare digital twin prototype that transforms EHR and wearable data into predictive insights for clinicians. It combines a React frontend, FastAPI backend, and an ML-driven risk model to simulate a doctor dashboard with live patient monitoring, alerts, EHR records, and AI-generated risk predictions.

## Problem Statement
Healthcare teams often need to synthesize fragmented patient information from historical records, wearable monitoring, and clinical markers to spot rising risk before it becomes critical. TwinCare AI demonstrates how a digital twin-style workflow can connect these streams into a unified patient view and prediction engine.

## Healthcare Use Case
The application models a doctor reviewing patient information in a clinical dashboard, including:
- digital twin status
- EHR history and labs
- wearable trends and live values
- AI risk predictions
- alerts and reported insights
- summary reporting for patient review

## Digital Twin Concept
The project simulates a living patient model where data from multiple streams converges into a digital representation of a patient. This is not a real clinical system; it is a proof-of-concept designed for demonstrations, research prototyping, and technical presentations.

## Architecture
The system is structured around the following flow:
- synthetic/open-source data sources
- EHR ingestion and wearable data collection
- data processing and feature engineering
- AI / ML prediction layer
- digital twin simulation
- clinician dashboard and reporting

## Data Sources
The demo uses synthetic, anonymized, and open-source style data created for demonstration purposes only. The dataset includes patient metadata, lab results, wearable measurements, alerts, and prediction outputs.

## AI / ML Model
The prediction API uses a lightweight scikit-learn-inspired rules-based model with feature weighting to estimate risk levels from values such as glucose, HRV, heart rate, sleep, steps, activity, HbA1c, and blood pressure. It produces a risk level, contextual prediction, confidence score, and contributing factors.

## Technical Stack
- Frontend: React, TypeScript, Vite, Tailwind CSS, Recharts, Lucide React
- Backend: Python, FastAPI
- AI / ML: Python, NumPy, Pandas, scikit-learn
- Data: Synthetic patient and wearable datasets

## Installation
### Frontend
```bash
cd E:/not work/TWINCARE AI/frontend
npm install
npm run dev
```

### Backend
```bash
cd E:/not work/TWINCARE AI/backend
python -m venv .venv
.venv\Scripts\python -m pip install --upgrade pip
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Demo Credentials
- Email: doctor@twincare.ai
- Password: demo123

## API Endpoints
- GET /api/health
- POST /api/predict
- GET /api/patients
- GET /api/alerts
- GET /api/reports

## Project Screenshots
Screenshots can be added here after running the app locally and capturing presentation views.

## Limitations
- This is a prototype and not a certified clinical decision-support system.
- Predictions are synthetic and designed for demonstration quality only.
- Data is not sourced from real patient records.

## Future Improvements
- integrate real EHR APIs and wearables
- add patient authentication and role-based access
- upgrade model to production-grade forecasting and calibration
- store data in a persistent database
- add exportable PDF report generation

## License
This project is licensed under the MIT License.

## Prototype Notice
This application is a Digital Twin proof-of-concept using synthetic, anonymized, or open-source data. AI predictions are for research and demonstration purposes only and are not medical diagnoses.
