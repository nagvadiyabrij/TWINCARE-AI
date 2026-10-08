# TwinCare AI Database

The current FastAPI backend creates `twincare.db` in this directory using SQLite and SQLAlchemy. Tables and demo records are created/seeded by `backend/app/main.py` when the service starts. The database file is generated locally and is ignored by Git.

PostgreSQL is not configured in the current implementation. The `backups/`, `migrations/`, and `seeds/` directories are reserved; no migration framework or separate seed scripts are currently provided.
