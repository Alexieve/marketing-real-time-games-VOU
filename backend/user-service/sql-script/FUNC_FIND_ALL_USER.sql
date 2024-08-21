CREATE OR REPLACE FUNCTION FUNC_FIND_ALL_USER()
RETURNS SETOF "USER"
LANGUAGE SQL
AS $$
    SELECT *
    FROM "USER";
$$;
-- INSERT INTO "USER" (NAME, EMAIL, PHONENUM, PASSWORD, ROLE, STATUS) VALUES
-- ('Yiorgos Avraamu', 'yiorgos@example.com', '1234567890', '123456', 'Admin', TRUE),
-- ('Avram Tarasios', 'avram@example.com', '9876543210', '123456', 'User', FALSE),
-- ('Quintin Ed', 'quintin@example.com', '5555555555', '123456', 'Brand', TRUE),
-- ('Enéas Kwadwo', 'eneas@example.com', '1112223333', '123456', 'User', TRUE),
-- ('Agapetus Tadeáš', 'agapetus@example.com', '4445556666', '123456', 'Admin', TRUE),
-- ('Friderik Dávid', 'friderik@example.com', '7778889999', '123456', 'User', FALSE);
