# TwinCare AI Project Report

## Project Information

- Project: TwinCare AI
- Team, institution, and challenge ID: Not supplied
- Repository: https://github.com/nagvadiyabrij/TWINCARE-AI (public access not verified)
- Live site and API: Not deployed

## Abstract

TwinCare AI is a healthcare Digital Twin proof-of-concept. The repository contains a React dashboard demonstration and a separate FastAPI service. The frontend uses local sample values, while the backend stores seeded records in SQLite and exposes a rule-based risk endpoint. These components are not integrated. The project illustrates a possible clinician workflow; it is not a validated clinical system.

## Problem and Motivation

Patient information may be distributed among historical records and wearable measurements. This prototype explores how a clinician-facing view could organize those kinds of signals and display a simple risk indicator. The implementation does not ingest real EHR or live wearable feeds and does not show that the prototype improves clinical outcomes.

## Scope and Use Case

The dashboard shows synthetic patient examples, static health measurements, trend charts, alerts, and prediction cards. A separate backend offers login, patient, Digital Twin, alert, report, settings, and prediction endpoints. A demo operator can inspect the UI locally and run the API separately.

The conceptual path is:

```text
EHR-style sample data + wearable-style sample data
  -> future data fusion
  -> Digital Twin-style patient view
  -> separate rule-based risk endpoint
  -> illustrative clinician-facing output
```

The arrows are conceptual: the CSV files are not automatically ingested, and the dashboard does not call the API.

## Implementation

### Frontend

The frontend uses React, TypeScript, Vite, Tailwind CSS, Recharts, and Lucide React. Its dashboard fixtures are defined in the frontend source. Demo role selection is held in browser `localStorage`. The Admin view is a static prototype, not a separate application or live database-backed administration interface.

### Backend and Database

The backend uses FastAPI, SQLAlchemy, Pydantic, and PyJWT. It creates SQLite tables and seeds demo users and records when the database is empty. PostgreSQL is not configured. The role checks protect several data routes, while health and prediction routes are unauthenticated in the current implementation.

### Risk Scoring

`POST /api/predict` applies fixed weights to threshold checks for glucose, sleep, activity, HRV, HbA1c, steps, and heart rate. It returns Low or Moderate risk, a prediction string, a formula-derived confidence value, a fixed two-hour prediction horizon, and contributing factors. It does not load a trained model, use a training dataset, report evaluation metrics, or produce High risk. The confidence value is not calibrated, and the output is not a medical diagnosis.

## Data and Privacy

The repository describes its sample CSV files as synthetic. They contain patient-like names and health attributes; their provenance must be confirmed by the maintainers before public release. No real patient data should be committed. Public deployment would also require replacing demonstration credentials, the development JWT fallback secret, and insecure password handling.

## Results and Evaluation

The frontend production build completed successfully during this work. Dependency resolution for the documented backend requirements also completed. A backend API request test could not be completed in this Windows environment because Application Control blocked SQLAlchemy's optional compiled DLL. No clinical or statistical model evaluation has been performed, and no patient outcome claims are made.

## Limitations

- Frontend and backend are separate and not integrated.
- Device streaming, EHR ingestion, and automated data fusion are not implemented.
- Dashboard values are static examples; backend records are seeded demonstration data.
- The predictor is a hand-written heuristic without training or validation.
- SQLite is the only configured database.
- Security controls and credentials are demonstration-grade.
- Public repository, website, API, demo video, team details, and institution details are not verified or supplied.

## Conclusion and Future Work

The repository demonstrates a dashboard concept and a separate backend prototype, not a production Digital Twin platform. Future work includes integrating the UI and API, validating sample-data provenance, improving security, adding authorized EHR/wearable ingestion, evaluating explainable prediction methods, and completing clinical, privacy, and regulatory review before any real-world use.

## Required Submission Attachments

The PDF report export, architecture PDF/PPTX, presentation PDF/PPTX, accessible demo video, team information, and institution information remain pending. This Markdown file is source material only and should not be represented as those completed deliverables.