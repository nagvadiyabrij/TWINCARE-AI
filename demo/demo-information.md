# TwinCare AI Demo Information

## Status

The repository currently contains a local frontend demo and a separate backend prototype. The frontend is not connected to the backend. A public website and public API have not been deployed.

## Frontend Demo

Run from `frontend/`:

```bash
npm ci
npm run dev
```

Use one of these local demo sign-ins:

| Role | Email | Password |
| --- | --- | --- |
| Doctor | `doctor@twincare.ai` | `Demo@123` |
| Admin | `admin@twincare.ai` | `Admin@123` |

These accounts only select a local prototype role. The frontend stores the demo session in browser `localStorage`; it does not call the backend login API.

## Suggested Walkthrough

1. Introduce the project as a synthetic-data Digital Twin proof-of-concept.
2. Sign in as Doctor and review the dashboard and patient list.
3. Open the Digital Twin-style view and explain that readings are static examples.
4. Review the prediction, alerts, and report screens as UI demonstrations.
5. Sign in as Admin and describe which dashboard content is static.
6. Separately run the FastAPI backend, inspect `/docs`, and demonstrate its SQLite-backed routes and threshold-based prediction endpoint.
7. Explain that the frontend and backend are not integrated and that the predictor is not clinically validated.

## Backend Demo

From the repository root, create/activate a Python virtual environment and install `requirements.txt`. Then run from `backend/`:

```bash
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The interactive API documentation is available at `http://localhost:8000/docs`. Seeded backend demo credentials are the same as above. The backend uses a local SQLite database and is not publicly hosted.

## Safety and Data

The project documentation identifies the bundled CSV samples as synthetic, but their provenance still needs maintainer confirmation before public submission. Do not use this prototype for care decisions or enter real patient data.

## Demo Video

No video link has been supplied. Add an accessible 15-20 minute public or unlisted video URL here after recording and testing it.