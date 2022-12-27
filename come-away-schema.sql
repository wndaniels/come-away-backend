CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
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
    day TEXT NOT NULL,
    year TEXT NOT NULL
);

CREATE TABLE calendar (
    id INTEGER PRIMARY KEY,
    day_id INTEGER 
        REFERENCES day ON DELETE CASCADE,
    month_id INTEGER 
        REFERENCES month ON DELETE CASCADE,
    year_id INTEGER 
        REFERENCES year ON DELETE CASCADE
);

CREATE TABLE day (
    id INTEGER PRIMARY KEY,
    day TEXT NOT NULL
);

CREATE TABLE month (
    id INTEGER PRIMARY KEY,
    month TEXT NOT NULL
);

CREATE TABLE year (
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


