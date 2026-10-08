# TwinCare AI Architecture

This diagram describes the current prototype, not a deployed integrated clinical system. The React demo uses local fixture data; the FastAPI service is separate and persists records in SQLite. The CSV files are not currently ingested by either runtime path.

```mermaid
flowchart LR
	clinician[Doctor or Admin] --> ui[React and TypeScript demo]
	ui --> fixtures[Local dashboard fixtures]
	ui --> session[Browser localStorage session]

	ehr[EHR-style CSV samples] -. not ingested .-> api[FastAPI REST prototype]
	wearable[Wearable-style CSV samples] -. not ingested .-> api
	api --> db[(SQLite via SQLAlchemy)]
	api --> scorer[Python threshold and weighted rules]
	scorer --> output[Risk response and prediction record]

	ui -. no API integration yet .-> api
```

The predictor currently considers glucose, heart rate, HRV, sleep, steps, activity, and HbA1c. It returns Low or Moderate risk, a heuristic confidence value, a fixed two-hour horizon, and contributing factors. No trained model, real-time streaming, PostgreSQL service, or architecture PDF is included.

The PDF/PPTX architecture deliverable required for submission has not yet been generated.
