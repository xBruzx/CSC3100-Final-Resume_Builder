//General set up 
const express = require('express');
const Database = require('better-sqlite3');
const PORT = 3000;
require('dotenv').config();

const app = express();
const db = new Database('resume_database.db');

app.use(express.json());
app.use(express.static('.')); //look in the current directory.

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});

//Create the database if it doesn't exist already
const createDb = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS tblProfile (
            profile_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name VARCHAR(256) NOT NULL,
            last_name VARCHAR(256) NOT NULL,
            email VARCHAR(256) NOT NULL,
            phone VARCHAR(20),
            linkedin VARCHAR(256),
            website VARCHAR(256),
            summary VARCHAR(2000)
        );

        CREATE TABLE IF NOT EXISTS tblJobs (
            job_id INTEGER PRIMARY KEY AUTOINCREMENT,
            job_title VARCHAR(256) NOT NULL,
            company VARCHAR(256) NOT NULL,
            job_start_date VARCHAR(256) NOT NULL,
            job_end_date VARCHAR(256),
            job_description VARCHAR(1000)
        );

        CREATE TABLE IF NOT EXISTS tblSkills (
            skill_id INTEGER PRIMARY KEY AUTOINCREMENT,
            skill_name VARCHAR(256) NOT NULL,
            skill_category VARCHAR(256)
        );

        CREATE TABLE IF NOT EXISTS tblCerts (
            cert_id INTEGER PRIMARY KEY AUTOINCREMENT,
            cert_name VARCHAR(256) NOT NULL,
            issuer VARCHAR(256),
            date_earned VARCHAR(256)
        );

        CREATE TABLE IF NOT EXISTS tblAwards (
            award_id INTEGER PRIMARY KEY AUTOINCREMENT,
            award_name VARCHAR(256) NOT NULL,
            issuer VARCHAR(256),
            date_earned VARCHAR(256),
            award_description VARCHAR(1000)
        );

    `);
};

createDb();


//Routes begin
app.post('/api/profile', (req, res) => {
    //We do insert or replace into for the table in case it already exists we update it 
    const dbStatement = db.prepare('INSERT OR REPLACE INTO tblProfile(first_name, last_name, email, phone, linkedin, website, summary) VALUES(?, ?, ?, ?, ?, ?, ?)');
    dbStatement.run(req.body.first_name, req.body.last_name, req.body.email, req.body.phone, req.body.linkedin, req.body.website, req.body.summary);

    return res.json({message: 'Profile saved successfully.'})
});

app.get('/api/profile', (req, res) => {
    //Then we want to get whatever we have in the profile table so the user can see what they have added.
    const row = db.prepare('SELECT * FROM tblProfile').get();
    
    return res.json(row || {});
});

app.post('/api/jobs', (req, res) => {
    const dbStatement = db.prepare('INSERT OR REPLACE INTO tblJobs(job_title, company, job_start_date, job_end_date, job_description) VALUES(?, ?, ?, ?, ?)');
    dbStatement.run(req.body.job_title, req.body.company, req.body.job_start_date, req.body.job_end_date, req.body.job_description);

    return res.json({message: 'Job saved successfully.'})
    
});

app.get('/api/jobs', (req, res) => {
    const row = db.prepare('SELECT * FROM tblJobs').all();

    return res.json(row || {});
});

app.post('/api/skills', (req, res) => {
    const dbStatement = db.prepare(`INSERT OR REPLACE INTO tblSkills(skill_name, skill_category) VALUES (?, ?)`);
    dbStatement.run(req.body.skill_name, req.body.skill_category);

    return res.json({message: 'Skills saved successfully.'})
});

app.get('/api/skills', (req, res) => {
    const row = db.prepare('SELECT * FROM tblSkills').all();

    return res.json(row || {});
});

app.post('/api/certs', (req, res) => {
    const dbStatement = db.prepare(`INSERT OR REPLACE INTO tblCerts(cert_name, issuer, date_earned) VALUES (?, ?, ?)`);
    dbStatement.run(req.body.cert_name, req.body.issuer, req.body.date_earned);

    return res.json({message: 'Certs saved successfully.'})

});

app.get('/api/certs', (req, res) => {
    const row = db.prepare('SELECT * FROM tblCerts').all();

    return res.json(row || {});

});

app.post('/api/awards', (req, res) => {
    const dbStatement = db.prepare(`INSERT OR REPLACE INTO tblAwards(award_name, issuer, date_earned, award_description) VALUES (?, ?, ?, ?)`);
    dbStatement.run(req.body.award_name, req.body.issuer, req.body.date_earned, req.body.award_description);

    return res.json({message: "Awards saved successfully."});
});

app.get('/api/awards', (req, res) => {
    const row = db.prepare('SELECT * FROM tblAwards').all();

    return res.json(row || {});
});


//Deletes


// GEMINI API - Get AI suggestions for resume content
app.post('/api/gemini', (req, res) => {
    const strContent = req.body.content;
    const strApiKey = process.env.GEMINI_API_KEY;

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${strApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `You are a professional resume advisor. Review the following resume content and provide 2-3 short, specific suggestions to improve it: ${strContent}`
                }]
            }]
        })
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        console.log("Gemini response:", JSON.stringify(data));
        const strSuggestion = data.candidates[0].content.parts[0].text;
        return res.json({ suggestion: strSuggestion });
    })
    .catch(function(err) {
        console.error("Gemini API error:", err);
        return res.json({ suggestion: "Could not get AI suggestions at this time." });
    });
});

// Get all resume data in one call
app.get('/api/resume', (req, res) => {
    const objProfile = db.prepare('SELECT * FROM tblProfile').get();
    const arrJobs = db.prepare('SELECT * FROM tblJobs').all();
    const arrSkills = db.prepare('SELECT * FROM tblSkills').all();
    const arrCerts = db.prepare('SELECT * FROM tblCerts').all();
    const arrAwards = db.prepare('SELECT * FROM tblAwards').all();

    return res.json({
        profile: objProfile || {},
        jobs: arrJobs,
        skills: arrSkills,
        certs: arrCerts,
        awards: arrAwards
    });
});

//Routes end