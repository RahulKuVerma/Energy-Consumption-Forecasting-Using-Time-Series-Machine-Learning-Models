import sqlite3
import os
from pathlib import Path
from contextlib import contextmanager
from typing import Generator
from backend.app.core.config import settings

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

@contextmanager
def get_db_connection() -> Generator[sqlite3.Connection, None, None]:
    """Context manager for SQLite database connection returning dictionary rows."""
    conn = sqlite3.connect(
        str(settings.DATABASE_PATH),
        timeout=30.0
    )
    conn.row_factory = dict_factory
    conn.execute("PRAGMA foreign_keys = ON;")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db(force: bool = False):
    """Initializes the database using schema.sql and seed.sql if not exists or if forced."""
    db_file = settings.DATABASE_PATH
    db_exists = db_file.exists() and db_file.stat().st_size > 0

    schema_file = settings.DATABASE_PATH.parent / "schema.sql"
    seed_file = settings.DATABASE_PATH.parent / "seed.sql"

    if not db_exists or force:
        with sqlite3.connect(str(db_file)) as conn:
            conn.execute("PRAGMA foreign_keys = ON;")
            if schema_file.exists():
                with open(schema_file, "r", encoding="utf-8") as f:
                    conn.executescript(f.read())
            if seed_file.exists():
                with open(seed_file, "r", encoding="utf-8") as f:
                    conn.executescript(f.read())
            conn.commit()
