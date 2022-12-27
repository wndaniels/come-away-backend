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

CREATE TABLE due_date (
    id INTEGER PRIMARY KEY,
    month TEXT NOT NULL,
    days TEXT NOT NULL,
    year TEXT NOT NULL
);

CREATE TABLE calendar (
    id INTEGER PRIMARY KEY,
    day_id INTEGER 
        REFERENCES days ON DELETE CASCADE,
    day_of_week_id INTEGER
        REFERENCES days_of_week ON DELETE CASCADE,
    month_id INTEGER 
        REFERENCES months ON DELETE CASCADE,
    year_id INTEGER 
        REFERENCES years ON DELETE CASCADE
);

CREATE TABLE days (
    id INTEGER PRIMARY KEY,
    day TEXT NOT NULL
);

CREATE TABLE days_of_week (
    id INTEGER PRIMARY KEY,
    day_of_week TEXT NOT NULL
)

CREATE TABLE months (
    id INTEGER PRIMARY KEY,
    month TEXT NOT NULL
);

CREATE TABLE years (
    id INTEGER PRIMARY KEY,
    year TEXT NOT NULL
);

CREATE TABLE mailing_list (
    id INTEGER PRIMARY KEY,
    guest_id INTEGER 
        REFERENCES guest ON DELETE CASCADE
);

CREATE TABLE guest (
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    gift BOOLEAN DEFAULT FALSE
    meal BOOLEAN DEFAULT FALSE
);


