CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    email       TEXT UNIQUE NOT NULL CHECK (POSITION('@' IN email) > 1), 
    password    TEXT NOT NULL,
    username    TEXT UNIQUE NOT NULL,
    first_name  TEXT NOT NULL,
    last_name   TEXT NOT NULL,
    is_admin    BOOLEAN NOT NULL DEFAULT FALSE
);