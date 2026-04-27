CREATE TABLE tblJobs (
    job_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company VARCHAR(256) NOT NULL,
    job_title VARCHAR(256) NOT NULL,
    job_start_date VARCHAR(256) NOT NULL,
    job_end_date VARCHAR(256),
    job_description VARCHAR(1000),
);