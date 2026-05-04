--Data base table for the users profile.
CREATE TABLE tblProfile (
    profile_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(256) NOT NULL,
    last_name VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL,
    phone VARCHAR(20),
    linkedin VARCHAR(256),
    website VARCHAR(256),
    summary VARCHAR(2000)
);

--Data base table for jobs that the user has worked at.
CREATE TABLE tblJobs (
    job_id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_title VARCHAR(256) NOT NULL,
    company VARCHAR(256) NOT NULL,
    job_start_date VARCHAR(256) NOT NULL,
    job_end_date VARCHAR(256),
    job_description VARCHAR(1000)
);

--Data base for the skills that the user enters in.
CREATE TABLE tblSkills (
    skill_id INTEGER PRIMARY KEY AUTOINCREMENT,
    skill_name VARCHAR(256) NOT NULL,
    skill_category VARCHAR(256)
);

--DB table for any certs that they might have.
CREATE TABLE tblCerts (
    cert_id INTEGER PRIMARY KEY AUTOINCREMENT,
    cert_name VARCHAR(256) NOT NULL,
    issuer VARCHAR(256),
    date_earned VARCHAR(256)
);

--DB table for any awards the user might have as well.
CREATE TABLE tblAwards (
    award_id INTEGER PRIMARY KEY AUTOINCREMENT,
    award_name VARCHAR(256) NOT NULL,
    issuer VARCHAR(256),
    date_earned VARCHAR(256),
    award_description VARCHAR(1000)
);