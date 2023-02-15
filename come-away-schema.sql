CREATE TABLE begin_hours (
    id SERIAL PRIMARY KEY,
    business_begins_hour TEXT NOT NULL
);

CREATE TABLE end_hours (
    id SERIAL PRIMARY KEY,
    business_ends_hour TEXT NOT NULL
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

CREATE TABLE due_dates (
    id SERIAL PRIMARY KEY,
    month_id INTEGER 
        REFERENCES months ON DELETE CASCADE,
    day_id INTEGER 
        REFERENCES days ON DELETE CASCADE,
    year_id INTEGER 
        REFERENCES years ON DELETE CASCADE
);

CREATE TABLE cal_views (
    id SERIAL PRIMARY KEY,
    view_type TEXT NOT NULL
);

CREATE TABLE calendars (
    id SERIAL PRIMARY KEY,
    cal_view_id INTEGER
        REFERENCES cal_views ON DELETE CASCADE,
    business_begins_hour_id INTEGER
        REFERENCES begin_hours ON DELETE CASCADE,
    business_ends_hour_id INTEGER
        REFERENCES end_hours ON DELETE CASCADE
);

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    business_begins_hour_id INTEGER
        REFERENCES begin_hours ON DELETE CASCADE,
    business_ends_hour_id INTEGER
        REFERENCES end_hours ON DELETE CASCADE,
    calendar_id INTEGER
        REFERENCES calendars ON DELETE CASCADE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    due_date_id INTEGER 
        REFERENCES due_dates ON DELETE CASCADE,
    calendar_id INTEGER 
        REFERENCES calendars ON DELETE CASCADE
);