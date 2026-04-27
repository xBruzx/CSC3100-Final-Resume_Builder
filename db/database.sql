CREATE TABLE tblJobs (
    job_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company VARCHAR(256) NOT NULL,
    start_date VARCHAR(256) NOT NULL,
    end_date VARCHAR(256),
    job_description VARCHAR(1000),
);