\echo 'Delete and recreate come_away db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE come_away;
CREATE DATABASE come_away;
\connect come_away

\i come-away-schema.sql
\i come-away-seed.sql

\echo 'Delete and recreate come_away_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE come_away_test;
CREATE DATABASE come_away_test;
\connect come_away_test

\i come-away-schema.sql
