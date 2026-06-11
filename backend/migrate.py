import os
from dotenv import load_dotenv
load_dotenv()
from database import db

SCHEMA = """
CREATE TABLE IF NOT EXISTS admin_users (
    id         SERIAL PRIMARY KEY,
    email      VARCHAR(255) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
    id            SERIAL PRIMARY KEY,
    title         VARCHAR(255) NOT NULL,
    slug          VARCHAR(255) UNIQUE NOT NULL,
    description   TEXT NOT NULL,
    long_desc     TEXT,
    image_url     TEXT,
    demo_url      TEXT,
    github_url    TEXT,
    technologies  TEXT[],
    category      VARCHAR(100),
    featured      BOOLEAN NOT NULL DEFAULT FALSE,
    live          BOOLEAN NOT NULL DEFAULT TRUE,
    challenges    TEXT,
    results       TEXT,
    sort_order    INTEGER DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id           SERIAL PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    slug         VARCHAR(255) UNIQUE NOT NULL,
    excerpt      TEXT,
    content      TEXT NOT NULL,
    cover_image  TEXT,
    category     VARCHAR(100),
    tags         TEXT[],
    published    BOOLEAN NOT NULL DEFAULT FALSE,
    featured     BOOLEAN NOT NULL DEFAULT FALSE,
    views        INTEGER NOT NULL DEFAULT 0,
    read_time    INTEGER DEFAULT 5,
    published_at TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(150) NOT NULL,
    role       VARCHAR(150),
    company    VARCHAR(150),
    content    TEXT NOT NULL,
    avatar_url TEXT,
    rating     INTEGER DEFAULT 5,
    featured   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(150) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    company    VARCHAR(150),
    subject    VARCHAR(255),
    message    TEXT NOT NULL,
    is_read    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certifications (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    issuer      VARCHAR(150) NOT NULL,
    issue_date  DATE,
    expiry_date DATE,
    credential_url TEXT,
    image_url   TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experiences (
    id           SERIAL PRIMARY KEY,
    company      VARCHAR(150) NOT NULL,
    position     VARCHAR(150) NOT NULL,
    location     VARCHAR(150),
    start_date   DATE NOT NULL,
    end_date     DATE,
    current      BOOLEAN NOT NULL DEFAULT FALSE,
    description  TEXT,
    achievements TEXT[],
    technologies TEXT[],
    company_url  TEXT,
    logo_url     TEXT,
    sort_order   INTEGER DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_stats (
    id          SERIAL PRIMARY KEY,
    page        VARCHAR(100),
    visitors    INTEGER DEFAULT 0,
    page_views  INTEGER DEFAULT 0,
    date        DATE DEFAULT CURRENT_DATE,
    UNIQUE(page, date)
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
"""

TRIGGERS = [("projects","trg_proj"),("blog_posts","trg_blog")]

if __name__ == "__main__":
    with db() as conn:
        with conn.cursor() as cur:
            cur.execute(SCHEMA)
            for table, trg in TRIGGERS:
                cur.execute(f"""
                    DROP TRIGGER IF EXISTS {trg} ON {table};
                    CREATE TRIGGER {trg} BEFORE UPDATE ON {table}
                    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
                """)
    print("✅ Migration complete")
