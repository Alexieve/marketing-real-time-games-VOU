-- DROP TABLE "BRAND" CASCADE;
-- DROP TABLE "CUSTOMER" CASCADE;
-- DROP TABLE "USER" CASCADE;
CREATE TABLE "USER" (
    ID SERIAL PRIMARY KEY,
    NAME VARCHAR(255) NOT NULL,
    EMAIL VARCHAR(255) UNIQUE NOT NULL,
    PHONENUM VARCHAR(10),
    PASSWORD VARCHAR(255) NOT NULL,
    ROLE VARCHAR(20),
    STATUS BOOLEAN
);

CREATE TABLE "BRAND" (
    USERID INT NOT NULL PRIMARY KEY,
    FIELD VARCHAR(255),
    AVATAR_URL VARCHAR(255),
    ADDRESS VARCHAR(255),
    FOREIGN KEY (USERID) REFERENCES "USER"(ID)
);

CREATE TABLE "CUSTOMER" (
    USERID INT NOT NULL PRIMARY KEY,
    GENDER VARCHAR(10),
    AVATAR_URL VARCHAR(255),
    FACEBOOK_URL VARCHAR(255),
    FOREIGN KEY (USERID) REFERENCES "USER"(ID)
);
CREATE OR REPLACE FUNCTION FUNC_FIND_ALL_USER()
RETURNS SETOF "USER"
LANGUAGE SQL
AS $$
    SELECT *
    FROM "USER";
$$;
CREATE OR REPLACE FUNCTION FUNC_FIND_USER_BY_EMAIL(
    P_EMAIL VARCHAR
)
RETURNS SETOF "USER"
LANGUAGE SQL
AS $$
    SELECT *
    FROM "USER"
    WHERE EMAIL = P_EMAIL;
$$;
CREATE OR REPLACE FUNCTION FUNC_FIND_USER_BY_ID(
    P_ID INTEGER
)
RETURNS SETOF "USER"
LANGUAGE SQL
AS $$
    SELECT *
    FROM "USER"
    WHERE ID = P_ID;
$$;
CREATE OR REPLACE PROCEDURE SP_CREATE_BRAND(
    P_USERID INTEGER,
	P_FIELD VARCHAR,
	P_ADDRESS VARCHAR
)
LANGUAGE SQL
AS $$
    INSERT INTO "BRAND" (USERID, FIELD, ADDRESS)
	VALUES (P_USERID, P_FIELD, P_ADDRESS);
$$;
CREATE OR REPLACE PROCEDURE SP_CREATE_USER(
	P_NAME VARCHAR,
	P_EMAIL VARCHAR,
	P_PHONENUM VARCHAR,
	P_PASSWORD VARCHAR,
	P_ROLE VARCHAR,
	P_STATUS BOOLEAN
)
LANGUAGE SQL 
AS $$
	INSERT INTO "USER" (NAME, EMAIL, PHONENUM, PASSWORD, ROLE, STATUS) 
    VALUES (P_NAME, P_EMAIL, P_PHONENUM, P_PASSWORD, P_ROLE, P_STATUS);
$$;
