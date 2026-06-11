import psycopg2
import psycopg2.extras
import os
from contextlib import contextmanager

def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST","localhost"),
        port=os.getenv("DB_PORT","5432"),
        dbname=os.getenv("DB_NAME","portfolio_db"),
        user=os.getenv("DB_USER","portfolio_user"),
        password=os.getenv("DB_PASSWORD","portfolio123"),
        cursor_factory=psycopg2.extras.RealDictCursor
    )

@contextmanager
def db():
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except:
        conn.rollback()
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
            try: return cur.fetchone()
            except: return None
