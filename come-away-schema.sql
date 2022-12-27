CREATE TABLE due_date (
    id SERIAL PRIMARY KEY,
    month TEXT NOT NULL,
    days TEXT NOT NULL,
    year TEXT NOT NULL
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


CREATE TABLE calendar (
    id SERIAL PRIMARY KEY,
    day_id INTEGER 
        REFERENCES days ON DELETE CASCADE,
    day_of_week_id INTEGER
        REFERENCES days_of_week ON DELETE CASCADE,
    month_id INTEGER 
        REFERENCES months ON DELETE CASCADE,
    year_id INTEGER 
        REFERENCES years ON DELETE CASCADE
);

CREATE TABLE guests (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    gift BOOLEAN DEFAULT FALSE,
    meal BOOLEAN DEFAULT FALSE
);


CREATE TABLE mailing_list (
    id SERIAL PRIMARY KEY,
    guest_id INTEGER 
        REFERENCES guests ON DELETE CASCADE
);


CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    due_date_id INTEGER 
        REFERENCES due_date ON DELETE CASCADE,
    calendar_id INTEGER 
        REFERENCES calendar ON DELETE CASCADE,
    mailing_list_id INTEGER 
        REFERENCES mailing_list ON DELETE CASCADE
);
