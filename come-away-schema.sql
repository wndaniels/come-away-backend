CREATE TABLE begin_hours (
    business_begins_hour INTEGER PRIMARY KEY,
    hour_title TEXT NOT NULL
);

CREATE TABLE end_hours (
    business_ends_hour INTEGER PRIMARY KEY,
    hour_title TEXT NOT NULL
);

CREATE TABLE days (
    id SERIAL PRIMARY KEY,
    day TEXT NOT NULL
);

CREATE TABLE days_of_week (
    id SERIAL PRIMARY KEY,
    day_of_week TEXT NOT NULL
);

CREATE TABLE months (
    id SERIAL PRIMARY KEY,
    month TEXT NOT NULL
);

CREATE TABLE years (
    id SERIAL PRIMARY KEY,
    year TEXT NOT NULL
);


CREATE TABLE cal_views (
    id SERIAL,
    view_title VARCHAR(25) PRIMARY KEY
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE due_dates (
    id SERIAL PRIMARY KEY,
    baby_name TEXT,
    year_id INTEGER 
        REFERENCES years ON DELETE CASCADE,
    month_id INTEGER 
        REFERENCES months ON DELETE CASCADE,
    day_id INTEGER 
        REFERENCES days ON DELETE CASCADE,
    user_id INTEGER
        REFERENCES users ON DELETE CASCADE UNIQUE
);

CREATE TABLE calendars (
    id SERIAL PRIMARY KEY,
    view_title VARCHAR(25)
        REFERENCES cal_views ON DELETE CASCADE,
    business_begins_hour_id INTEGER
        REFERENCES begin_hours ON DELETE CASCADE,
    business_ends_hour_id INTEGER
        REFERENCES end_hours ON DELETE CASCADE,
    user_id INTEGER
        REFERENCES users ON DELETE CASCADE UNIQUE
);

CREATE TABLE visitors (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    note TEXT,
    start_time INTEGER
        REFERENCES begin_hours ON DELETE CASCADE,
    end_time INTEGER
        REFERENCES end_hours ON DELETE CASCADE,
    calendar_id INTEGER
        REFERENCES calendars ON DELETE CASCADE
);