/* ####################################
* 'testuser' and 'testadmin' passwords are 'testpassword'
#################################### */

INSERT INTO cal_views (view_title)
VALUES  ('Day'),
        ('Week');

INSERT INTO begin_hours (business_begins_hour, hour_title, iso_time)
VALUES  ('0', '12:00 AM', '00:00:00'),
        ('1', '1:00 AM', '01:00:00'),
        ('2', '2:00 AM', '02:00:00'),
        ('3', '3:00 AM', '03:00:00'),
        ('4', '4:00 AM', '04:00:00'),
        ('5', '5:00 AM', '05:00:00'),
        ('6', '6:00 AM', '06:00:00'),
        ('7', '7:00 AM', '07:00:00'),
        ('8', '8:00 AM', '08:00:00'),
        ('9', '9:00 AM', '09:00:00'),
        ('10', '10:00 AM', '10:00:00'),
        ('11', '11:00 AM', '11:00:00'),
        ('12', '12:00 PM', '12:00:00'),
        ('13', '1:00 PM', '13:00:00'),
        ('14', '2:00 PM', '14:00:00'),
        ('15', '3:00 PM', '15:00:00'),
        ('16', '4:00 PM', '16:00:00'),
        ('17', '5:00 PM', '17:00:00'),
        ('18', '6:00 PM', '18:00:00'),
        ('19', '7:00 PM', '19:00:00'),
        ('20', '8:00 PM', '20:00:00'),
        ('21', '9:00 PM', '21:00:00'),
        ('22', '10:00 PM', '22:00:00'),
        ('23', '11:00 PM', '23:00:00');

INSERT INTO end_hours (business_ends_hour, hour_title, iso_time)
VALUES  ('1', '12:00 AM', '00:00:00'),
        ('2', '1:00 AM', '01:00:00'),
        ('3', '2:00 AM', '02:00:00'),
        ('4', '3:00 AM', '03:00:00'),
        ('5', '4:00 AM', '04:00:00'),
        ('6', '5:00 AM', '05:00:00'),
        ('7', '6:00 AM', '06:00:00'),
        ('8', '7:00 AM', '07:00:00'),
        ('9', '8:00 AM', '08:00:00'),
        ('10', '9:00 AM', '09:00:00'),
        ('11', '10:00 AM', '10:00:00'),
        ('12', '11:00 AM', '11:00:00'),
        ('13', '12:00 PM', '12:00:00'),
        ('14', '1:00 PM', '13:00:00'),
        ('15', '2:00 PM', '14:00:00'),
        ('16', '3:00 PM', '15:00:00'),
        ('17', '4:00 PM', '16:00:00'),
        ('18', '5:00 PM', '17:00:00'),
        ('19', '6:00 PM', '18:00:00'),
        ('20', '7:00 PM', '19:00:00'),
        ('21', '8:00 PM', '20:00:00'),
        ('22', '9:00 PM', '21:00:00'),
        ('23', '10:00 PM', '22:00:00'),
        ('24', '11:00 PM', '23:00:00');


INSERT INTO days (day)
VALUES  ('1'),
        ('2'),
        ('3'),
        ('4'),
        ('5'),
        ('6'),
        ('7'),
        ('8'),
        ('9'),
        ('10'),
        ('11'),
        ('12'),
        ('13'),
        ('14'),
        ('15'),
        ('16'),
        ('17'),
        ('18'),
        ('19'),
        ('20'),
        ('21'),
        ('22'),
        ('23'),
        ('24'),
        ('25'),
        ('26'),
        ('27'),
        ('28'),
        ('29'),
        ('30'),
        ('31');

INSERT INTO days_of_week (day_of_week)
VALUES  ('Sunday'),
        ('Monday'),
        ('Tuesday'),
        ('Wednesday'),
        ('Thursday'),
        ('Friday'),
        ('Saturday');

INSERT INTO months (month)
VALUES  ('January'),
        ('February'),
        ('March'),
        ('April'),
        ('May'),
        ('June'),
        ('July'),
        ('August'),
        ('September'),
        ('October'),
        ('November'),
        ('December');

INSERT INTO years (year)
VALUES  ('2023'),
        ('2024'),
        ('2025'),
        ('2026'),
        ('2027'),
        ('2028'),
        ('2029'),
        ('2030'),
        ('2031'),
        ('2032'),
        ('2033'),
        ('2034'),
        ('2035'),
        ('2036'),
        ('2037'),
        ('2038'),
        ('2039'),
        ('2040'),
        ('2041'),
        ('2042'),
        ('2043'),
        ('2044'),
        ('2045'),
        ('2046'),
        ('2047'),
        ('2048'),
        ('2049'),
        ('2050');


INSERT INTO users (username, password, first_name, last_name, email, is_admin) 
VALUES  ('testuser',
        '$2b$12$2jl0LrjhXmqZY/xqr7zExe49BNxhdE03c4eOvFaaHLJh7zP0Iyjwy', 
        'Test', 
        'User', 
        'testuser@comeawayapp.com',
        FALSE),
        ('testadmin',
        '$2b$12$pASGK7CseJKX/VnR0XhTlui2/BIGSojRC0QEnUEwFhz8ria2wTK8m',
        'Test',
        'Admin',
        'testadmin@comeawayapp.com',
        TRUE);

INSERT INTO calendars (view_title, business_begins_hour_id, business_ends_hour_id, user_id)
VALUES ('Week', 5, 23, 2),('Week',9,20, 1);

INSERT INTO due_dates (baby_name, year_id, month_id, day_id, user_id)
VALUES ('Elijah Rye Daniels', 1, 12, 6, 2), ('Everly Grace Daniels', 2, 8, 24, 1);

INSERT INTO visitors (full_name, note, start_time, end_time, calendar_id)
VALUES ('Nathan Daniels', 'Congratulations!!', '2023-12-07T06:00:00', '2023-12-07T07:00:00', 1)