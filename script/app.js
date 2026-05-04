// app.js - Main frontend JavaScript for Resume Builder
// Handles SPA navigation between all sections


//Navigation helper functions

// Hides all sections inside the main content area
function hideAllSections() {
    document.querySelector("#divDashboard").style.display = "none";
    document.querySelector("#divProfile").style.display = "none";
    document.querySelector("#divJobs").style.display = "none";
    document.querySelector("#divSkills").style.display = "none";
    document.querySelector("#divCerts").style.display = "none";
    document.querySelector("#divAwards").style.display = "none";
    document.querySelector("#divResume").style.display = "none";
    document.querySelector("#divSettings").style.display = "none";
}

// Shows a specific section by its ID
function showSection(strSectionId) {
    hideAllSections();
    document.querySelector(strSectionId).style.display = "block";
}

// Removes the active highlight from all sidebar buttons
function clearActiveNav() {
    const arrNavButtons = document.querySelectorAll("#divSidebar .btn");
    arrNavButtons.forEach(function(btnItem) {
        btnItem.classList.remove("btn-secondary");
        btnItem.classList.add("btn-dark");
    });
}

// Highlights the active sidebar button
function setActiveNav(strButtonId) {
    clearActiveNav();
    const btnActive = document.querySelector(strButtonId);
    btnActive.classList.remove("btn-dark");
    btnActive.classList.add("btn-secondary");
}


//Hides the wecome screen when the user selects get started on the home page.
document.querySelector("#btnGetStarted").addEventListener("click", function() {
    document.querySelector("#divWelcome").style.display = "none";

    // Remove the centering classes from the body since the app shell
    // handles its own layout
    document.querySelector("#bdyMain").classList.remove("justify-content-center", "align-items-center", "vh-100");

    document.querySelector("#divAppShell").style.display = "flex";

    // Default to showing the dashboard first
    showSection("#divDashboard");
    setActiveNav("#btnNavDashboard");
});


//Sidebar buttons
document.querySelector("#btnNavDashboard").addEventListener("click", function() {
    showSection("#divDashboard");
    setActiveNav("#btnNavDashboard");
});

document.querySelector("#btnNavProfile").addEventListener("click", function() {
    showSection("#divProfile");
    setActiveNav("#btnNavProfile");
});

document.querySelector("#btnNavJobs").addEventListener("click", function() {
    showSection("#divJobs");
    setActiveNav("#btnNavJobs");
});

document.querySelector("#btnNavSkills").addEventListener("click", function() {
    showSection("#divSkills");
    setActiveNav("#btnNavSkills");
});

document.querySelector("#btnNavCerts").addEventListener("click", function() {
    showSection("#divCerts");
    setActiveNav("#btnNavCerts");
});

document.querySelector("#btnNavAwards").addEventListener("click", function() {
    showSection("#divAwards");
    setActiveNav("#btnNavAwards");
});

document.querySelector("#btnNavResume").addEventListener("click", function() {
    showSection("#divResume");
    setActiveNav("#btnNavResume");
});

document.querySelector("#btnNavSettings").addEventListener("click", function() {
    showSection("#divSettings");
    setActiveNav("#btnNavSettings");
});


//Dashboard actions
document.querySelector("#btnDashGoProfile").addEventListener("click", function() {
    showSection("#divProfile");
    setActiveNav("#btnNavProfile");
});

document.querySelector("#btnDashGoJobs").addEventListener("click", function() {
    showSection("#divJobs");
    setActiveNav("#btnNavJobs");
});

document.querySelector("#btnDashGoSkills").addEventListener("click", function() {
    showSection("#divSkills");
    setActiveNav("#btnNavSkills");
});

document.querySelector("#btnDashGoResume").addEventListener("click", function() {
    showSection("#divResume");
    setActiveNav("#btnNavResume");
});

//End Side Nav Helper functions

//Begin Form handling

// Profile Form - Save profile data to the database
document.querySelector("#frmProfile").addEventListener("submit", function(e) {
    // Prevents the form from refreshing the page on submit
    e.preventDefault();

    // Grab all the values from the profile form fields
    const objProfileData = {
        first_name: document.querySelector("#txtFirstName").value,
        last_name: document.querySelector("#txtLastName").value,
        email: document.querySelector("#txtEmail").value,
        phone: document.querySelector("#txtPhone").value,
        linkedin: document.querySelector("#txtLinkedin").value,
        website: document.querySelector("#txtWebsite").value,
        summary: document.querySelector("#txtSummary").value
    };

    // Send the data to the backend API
    fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(objProfileData)
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        alert(data.message);
    })
    .catch(function(err) {
        console.error("Error saving profile:", err);
        alert("Something went wrong saving your profile.");
    });
});

// Load profile data when the profile section is opened
document.querySelector("#btnNavProfile").addEventListener("click", function() {
    fetch("/api/profile")
    .then(function(res) { return res.json(); })
    .then(function(data) {
        // Fill in the form fields with whatever is in the database
        document.querySelector("#txtFirstName").value = data.first_name || "";
        document.querySelector("#txtLastName").value = data.last_name || "";
        document.querySelector("#txtEmail").value = data.email || "";
        document.querySelector("#txtPhone").value = data.phone || "";
        document.querySelector("#txtLinkedin").value = data.linkedin || "";
        document.querySelector("#txtWebsite").value = data.website || "";
        document.querySelector("#txtSummary").value = data.summary || "";
    })
    .catch(function(err) {
        console.error("Error loading profile:", err);
    });
});


// Jobs Form - Save job data to the database
document.querySelector("#frmJobs").addEventListener("submit", function(e) {
    e.preventDefault();

    const objJobData = {
        job_title: document.querySelector("#txtJobTitle").value,
        company: document.querySelector("#txtCompany").value,
        job_start_date: document.querySelector("#txtJobStartDate").value,
        job_end_date: document.querySelector("#txtJobEndDate").value,
        job_description: document.querySelector("#txtJobDescription").value
    };

    fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(objJobData)
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        alert(data.message);
        // Clear the form after saving
        document.querySelector("#frmJobs").reset();
        // Reload the job list
        loadJobs();
    })
    .catch(function(err) {
        console.error("Error saving job:", err);
        alert("Something went wrong saving your job.");
    });
});

// Load all jobs and display them in divJobList
function loadJobs() {
    fetch("/api/jobs")
    .then(function(res) { return res.json(); })
    .then(function(arrJobs) {
        const divJobList = document.querySelector("#divJobList");
        divJobList.innerHTML = "";

        arrJobs.forEach(function(objJob) {
            divJobList.innerHTML += `
                <div class="card bg-secondary text-white p-3 mb-2">
                    <h5>${objJob.job_title} at ${objJob.company}</h5>
                    <p class="mb-1">${objJob.job_start_date} - ${objJob.job_end_date || "Present"}</p>
                    <p class="mb-0">${objJob.job_description || ""}</p>
                </div>
            `;
        });
    })
    .catch(function(err) {
        console.error("Error loading jobs:", err);
    });
}

// Load jobs when the jobs section is opened
document.querySelector("#btnNavJobs").addEventListener("click", function() {
    loadJobs();
});

// Skills Form - Save skill data to the database
document.querySelector("#frmSkills").addEventListener("submit", function(e) {
    e.preventDefault();

    const objSkillData = {
        skill_name: document.querySelector("#txtSkillName").value,
        skill_category: document.querySelector("#txtSkillCategory").value
    };

    fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(objSkillData)
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        alert(data.message);
        document.querySelector("#frmSkills").reset();
        loadSkills();
    })
    .catch(function(err) {
        console.error("Error saving skill:", err);
        alert("Something went wrong saving your skill.");
    });
});

// Load all skills and display them in divSkillList
function loadSkills() {
    fetch("/api/skills")
    .then(function(res) { return res.json(); })
    .then(function(arrSkills) {
        const divSkillList = document.querySelector("#divSkillList");
        divSkillList.innerHTML = "";

        arrSkills.forEach(function(objSkill) {
            divSkillList.innerHTML += `
                <div class="card bg-secondary text-white p-3 mb-2">
                    <h5>${objSkill.skill_name}</h5>
                    <p class="mb-0">${objSkill.skill_category || "Uncategorized"}</p>
                </div>
            `;
        });
    })
    .catch(function(err) {
        console.error("Error loading skills:", err);
    });
}

// Load skills when the skills section is opened
document.querySelector("#btnNavSkills").addEventListener("click", function() {
    loadSkills();
});


// Certs Form - Save certification data to the database
document.querySelector("#frmCerts").addEventListener("submit", function(e) {
    e.preventDefault();

    const objCertData = {
        cert_name: document.querySelector("#txtCertName").value,
        issuer: document.querySelector("#txtCertIssuer").value,
        date_earned: document.querySelector("#txtCertDateEarned").value
    };

    fetch("/api/certs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(objCertData)
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        alert(data.message);
        document.querySelector("#frmCerts").reset();
        loadCerts();
    })
    .catch(function(err) {
        console.error("Error saving certification:", err);
        alert("Something went wrong saving your certification.");
    });
});

// Load all certs and display them in divCertList
function loadCerts() {
    fetch("/api/certs")
    .then(function(res) { return res.json(); })
    .then(function(arrCerts) {
        const divCertList = document.querySelector("#divCertList");
        divCertList.innerHTML = "";

        arrCerts.forEach(function(objCert) {
            divCertList.innerHTML += `
                <div class="card bg-secondary text-white p-3 mb-2">
                    <h5>${objCert.cert_name}</h5>
                    <p class="mb-1">${objCert.issuer || ""}</p>
                    <p class="mb-0">${objCert.date_earned || ""}</p>
                </div>
            `;
        });
    })
    .catch(function(err) {
        console.error("Error loading certifications:", err);
    });
}

// Load certs when the certs section is opened
document.querySelector("#btnNavCerts").addEventListener("click", function() {
    loadCerts();
});


// Awards Form - Save award data to the database
document.querySelector("#frmAwards").addEventListener("submit", function(e) {
    e.preventDefault();

    const objAwardData = {
        award_name: document.querySelector("#txtAwardName").value,
        issuer: document.querySelector("#txtAwardIssuer").value,
        date_earned: document.querySelector("#txtAwardDateEarned").value,
        award_description: document.querySelector("#txtAwardDescription").value
    };

    fetch("/api/awards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(objAwardData)
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        alert(data.message);
        document.querySelector("#frmAwards").reset();
        loadAwards();
    })
    .catch(function(err) {
        console.error("Error saving award:", err);
        alert("Something went wrong saving your award.");
    });
});

// Load all awards and display them in divAwardList
function loadAwards() {
    fetch("/api/awards")
    .then(function(res) { return res.json(); })
    .then(function(arrAwards) {
        const divAwardList = document.querySelector("#divAwardList");
        divAwardList.innerHTML = "";

        arrAwards.forEach(function(objAward) {
            divAwardList.innerHTML += `
                <div class="card bg-secondary text-white p-3 mb-2">
                    <h5>${objAward.award_name}</h5>
                    <p class="mb-1">${objAward.issuer || ""}</p>
                    <p class="mb-1">${objAward.date_earned || ""}</p>
                    <p class="mb-0">${objAward.award_description || ""}</p>
                </div>
            `;
        });
    })
    .catch(function(err) {
        console.error("Error loading awards:", err);
    });
}

// Load awards when the awards section is opened
document.querySelector("#btnNavAwards").addEventListener("click", function() {
    loadAwards();
});


// Settings Page - Save Gemini API key
document.querySelector("#frmSettings").addEventListener("submit", function(e) {
    e.preventDefault();

    const strApiKey = document.querySelector("#txtApiKey").value;
    localStorage.setItem("geminiApiKey", strApiKey);
    alert("API key saved successfully!");
});

// Load the saved API key when settings opens
document.querySelector("#btnNavSettings").addEventListener("click", function() {
    const strSavedKey = localStorage.getItem("geminiApiKey");
    if (strSavedKey) {
        document.querySelector("#txtApiKey").value = strSavedKey;
    }
});

//End form handling

//Setting up Gemini
// GEMINI AI - Get suggestions for resume content
// Triggered by a button on the jobs and profile sections
function getAiSuggestion(strContent) {
    fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: strContent })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        alert("AI Suggestion:\n\n" + data.suggestion);
    })
    .catch(function(err) {
        console.error("Error getting AI suggestion:", err);
        alert("Could not get AI suggestions at this time.");
    });
}

//Setting up functionality for making AI suggestions to the user.
document.querySelector("#btnProfileAiSuggest").addEventListener("click", function() {
    const strContent = document.querySelector("#txtSummary").value;
    getAiSuggestion(strContent);
});

document.querySelector("#btnJobAiSuggest").addEventListener("click", function() {
    const strContent = document.querySelector("#txtJobDescription").value;
    getAiSuggestion(strContent);
});

// Load and display resume preview
document.querySelector("#btnNavResume").addEventListener("click", function() {
    fetch("/api/resume")
    .then(function(res) { return res.json(); })
    .then(function(data) {
        const divResume = document.querySelector("#divResume");
        divResume.innerHTML = `
            <h2>Resume Preview</h2>
            <hr />
            <div id="divResumePreview" class="bg-white text-dark p-4">
                <h1>${data.profile.first_name || ""} ${data.profile.last_name || ""}</h1>
                <p>${data.profile.email || ""} | ${data.profile.phone || ""} | ${data.profile.linkedin || ""}</p>
                <hr />
                <h4>Summary</h4>
                <p>${data.profile.summary || ""}</p>
                <hr />
                <h4>Work Experience</h4>
                ${data.jobs.map(function(objJob) { return `
                    <div class="mb-3">
                        <strong>${objJob.job_title}</strong> at ${objJob.company}<br/>
                        <small>${objJob.job_start_date} - ${objJob.job_end_date || "Present"}</small>
                        <p>${objJob.job_description || ""}</p>
                    </div>
                `; }).join("")}
                <hr />
                <h4>Skills</h4>
                <p>${data.skills.map(function(objSkill) { return objSkill.skill_name; }).join(", ")}</p>
                <hr />
                <h4>Certifications</h4>
                ${data.certs.map(function(objCert) { return `
                    <div class="mb-2">
                        <strong>${objCert.cert_name}</strong> - ${objCert.issuer || ""} (${objCert.date_earned || ""})
                    </div>
                `; }).join("")}
                <hr />
                <h4>Awards</h4>
                ${data.awards.map(function(objAward) { return `
                    <div class="mb-2">
                        <strong>${objAward.award_name}</strong> - ${objAward.issuer || ""} (${objAward.date_earned || ""})
                        <p>${objAward.award_description || ""}</p>
                    </div>
                `; }).join("")}
            </div>
            <button class="btn btn-success mt-3" onclick="window.print()">Print Resume</button>
        `;
    })
    .catch(function(err) {
        console.error("Error loading resume:", err);
    });
});