import psycopg2
import psycopg2.extras
import os
import logging
from contextlib import contextmanager

logger = logging.getLogger(__name__)


def get_connection():
    db_host = os.getenv("DB_HOST")
    db_port = os.getenv("DB_PORT")
    db_name = os.getenv("DB_NAME")
    db_user = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD")

    # Fail fast if config is missing
    missing = [k for k, v in {
        "DB_HOST": db_host,
        "DB_NAME": db_name,
        "DB_USER": db_user,
        "DB_PASSWORD": db_password,
    }.items() if not v]

    if missing:
        raise RuntimeError(f"Missing environment variables: {', '.join(missing)}")

    return psycopg2.connect(
        host=db_host,
        port=db_port or "5432",
        dbname=db_name,
        user=db_user,
        password=db_password,
        cursor_factory=psycopg2.extras.RealDictCursor
    )


@contextmanager
def db():
    conn = get_connection()
    try:
        yield conn
        conn.commit()

    except Exception as e:
        conn.rollback()
        logger.error(f"Database error: {e}")
        raise

    finally:
        conn.close()


def query_one(sql, params=()):
    with db() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            return cur.fetchone()


def query_all(sql, params=()):
    with db() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            return cur.fetchall()


def execute(sql, params=()):
    with db() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, params)

            if cur.description:
                return cur.fetchone()

            return None