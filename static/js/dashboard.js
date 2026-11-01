

/* =========================================================
   GLOBAL USER DATA
 
  ========================================================= */

const USER_ROLE =
    window.USER_ROLE || "student";

const USER_DEPARTMENT =
    window.USER_DEPARTMENT || "";


/* =========================================================
   ROLE CONFIGURATION
   ========================================================= */

const roleConfig = {

    student: {
        label: "Student",

        defaultView: "std-dashboard",

        navigation: [
            {
                id: "std-dashboard",
                label: "Dashboard"
            },
            {
                id: "std-notes",
                label: "Notes"
            },
            {
                id: "std-assignments",
                label: "Assignments"
            },
            {
                id: "std-attendance",
                label: "Attendance"
            },
            {
                id: "std-documents",
                label: "Documents"
            },
            {
                id: "std-marks",
                label: "Marks"
            },
            {
                id: "std-announcements",
                label: "Announcements"
            },
            {
                id: "std-voice",
                label: "Student Voice"
            },
            {
                id: "std-leave",
                label: "Leave Application"
            }
        ]
    },

    representative: {
        label: "Representative",

        defaultView: "std-dashboard",

        navigation: [
            {
                id: "std-dashboard",
                label: "Dashboard"
            },
            {
                id: "std-notes",
                label: "Notes"
            },
            {
                id: "std-assignments",
                label: "Assignments"
            },
            {
                id: "std-attendance",
                label: "Attendance"
            },
            {
                id: "std-marks",
                label: "Marks"
            },
            {
                id: "std-announcements",
                label: "Announcements"
            },
            {
                id: "std-voice",
                label: "Student Voice"
            },
            {
                id: "std-leave",
                label: "Leave Application"
            }
        ]
    },

  
faculty: {
    label: "Faculty",

    defaultView: "faculty-dashboard",

    navigation: [
    {
        id: "faculty-dashboard",
        label: "Dashboard"
    },
    {
        id: "faculty-attendance",
        label: "Attendance"
    },
    {
        id: "faculty-leave-approval",
        label: "Leave Approval"
    },
    {
        id: "faculty-department-timetables",
        label: "Department Timetables"
    },
    {
        id: "faculty-marks",
        label: "Marks Entry"
    },
    {
        id: "faculty-assignments",
        label: "Assignments"
    },
    {
    id: "faculty-notes",
    label: "Notes"
},
{
    id: "faculty-notices",
    label: "Notices"
},
    {
    id: "faculty-student-voice",
    label: "Student Voice"
},
    {
        id: "faculty-my-class",
        label: "My Class",
        children: [
            {
                id: "faculty-documents",
                label: "Student Documents"
            },
            {
                id: "faculty-all-subject-marks",
                label: "All Subject Marks"
            }
        ]
    }
]
},

    admin: {
        label: "Admin",

        defaultView: "admin-dashboard",

        navigation: [
            {
                id: "admin-dashboard",
                label: "Dashboard"
            }
        ]
    }

};


/* =========================================================
   NORMALIZE ROLE
   ========================================================= */

function normalizeRole(role) {

    if (!role) {
        return "student";
    }

    role = String(role)
        .trim()
        .toLowerCase();

    if (role === "student") {
        return "student";
    }

    if (
        role === "representative" ||
        role === "rep" ||
        role === "class representative"
    ) {
        return "representative";
    }

    if (
        role === "faculty" ||
        role === "staff"
    ) {
        return "faculty";
    }

    if (role === "admin" ||
        role === "administrator") {
        return "admin";
    }

    return "student";
}


/* =========================================================
   CURRENT ROLE
   ========================================================= */

const currentRole =
    normalizeRole(USER_ROLE);

const currentRoleConfig =
    roleConfig[currentRole] ||
    roleConfig.student;


/* =========================================================
   ELEMENTS
   ========================================================= */

const navList =
    document.getElementById("navList");

const viewContainer =
    document.getElementById("viewContainer");

const pageTitle =
    document.getElementById("page-title");

const deptPill =
    document.getElementById("deptPill");

const userName =
    document.getElementById("userName");

const userRole =
    document.getElementById("userRole");

const userAvatar =
    document.getElementById("userAvatar");


/* =========================================================
   INITIAL USER DISPLAY
   ========================================================= */

if (userRole) {

    userRole.textContent =
        currentRoleConfig.label;

}


if (deptPill) {

    deptPill.textContent =
        USER_DEPARTMENT;

}


if (userName && userName.textContent.trim()) {

    const name =
        userName.textContent.trim();

    if (userAvatar) {

        userAvatar.textContent =
            name.charAt(0).toUpperCase();

    }

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function renderNavigation() {
    if (!navList) {
        return;
    }

    navList.innerHTML = "";

    currentRoleConfig.navigation.forEach(item => {
        const li = document.createElement("li");

        // Normal navigation items
        if (!item.children) {
            const link = document.createElement("a");

            link.className = "nav-link";
            link.href = "#";
            link.textContent = item.label;
            link.dataset.view = item.id;

            link.addEventListener("click", function (event) {
                event.preventDefault();

                loadView(item.id, item.label, link);
            });

            li.appendChild(link);
        } else {
            // Expandable parent navigation
            const parentLink = document.createElement("a");
            const submenu = document.createElement("ul");

            parentLink.className = "nav-link nav-parent";
            parentLink.href = "#";
            parentLink.textContent = item.label;
            parentLink.setAttribute("aria-expanded", "false");

            submenu.className = "nav-submenu";
            submenu.hidden = true;

            parentLink.addEventListener("click", function (event) {
                event.preventDefault();

                const isExpanded =
                    parentLink.getAttribute("aria-expanded") === "true";

                parentLink.setAttribute(
                    "aria-expanded",
                    String(!isExpanded)
                );

                submenu.hidden = isExpanded;
                li.classList.toggle("submenu-open", !isExpanded);
            });

            item.children.forEach(child => {
                const childLi = document.createElement("li");
                const childLink = document.createElement("a");

                childLink.className = "nav-link nav-child";
                childLink.href = "#";
                childLink.textContent = child.label;
                childLink.dataset.view = child.id;

                childLink.addEventListener("click", function (event) {
                    event.preventDefault();

                    loadView(child.id, child.label, childLink);
                });

                childLi.appendChild(childLink);
                submenu.appendChild(childLi);
            });

            li.appendChild(parentLink);
            li.appendChild(submenu);
        }

        navList.appendChild(li);
    });
}

/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

function setActiveNavigation(viewId) {

    if (!navList) {
        return;
    }

    const links =
        navList.querySelectorAll(".nav-link");

    links.forEach(link => {

        if (link.dataset.view === viewId) {

            link.classList.add("active");

        } else {

            link.classList.remove("active");

        }

    });

}


/* =========================================================
   LOAD VIEW
   ========================================================= */

function loadView(
    viewId,
    title,
    element
) {

    if (!viewContainer) {
        return;
    }


    if (pageTitle) {

        pageTitle.textContent =
            title;

    }


    setActiveNavigation(viewId);


    viewContainer.innerHTML =
        renderTemplate(
            viewId,
            USER_DEPARTMENT
        );
    if (viewId === "std-voice") {
        initStudentVoice();
    }
    if (viewId === "std-leave") {
        if (typeof window.loadLeaveApplicationHistory === "function") {
            window.loadLeaveApplicationHistory();
        } else {
            console.error(
                "loadLeaveApplicationHistory is not defined on window."
            );
        }
    }


if (viewId === "std-documents") {
    const fileInput = document.getElementById("documentFile");
    const fileName = document.getElementById("selectedFileName");
    const form = document.getElementById("studentDocumentForm");
    const message = document.getElementById("documentMessage");

    if (fileInput && fileName) {
        fileInput.addEventListener("change", function () {
            fileName.textContent = this.files.length
                ? "Selected file: " + this.files[0].name
                : "No file selected";
        });
    }

            if (form) {
            form.addEventListener("submit", async function (event) {
                // Your existing upload code stays here
            });
        }

        // ADD THIS LINE HERE
        loadStudentDocuments();
    }

    if (viewId === "std-dashboard") {
        loadTimetable();
    }

    /*
     * Existing student data loaders can
     * continue to run here if they are
     * already present in your project.
     */

    if (
        viewId === "std-notes" &&
        typeof loadStudentNotes === "function"
    ) {
        loadStudentNotes();
    }

    if (viewId === "std-marks") {
    loadStudentMarks();
}
    if (
        viewId === "std-assignments" &&
        typeof loadStudentAssignments === "function"
    ) {
        loadStudentAssignments();
    }

    if (viewId === "std-assignments") {
    loadMySubmissions();
}
        if (
        viewId === "std-attendance" &&
        typeof loadStudentAttendance === "function"
    ) {
        loadStudentAttendance();
    }

    if (
        viewId === "faculty-marks" &&
        typeof loadFacultySubjects === "function"
    ) {
        loadFacultySubjects();
    }
    if (viewId === "faculty-all-subject-marks") {

    initAllSubjectMarks();

    const exportButton = document.getElementById("exportExcelBtn");

    if (exportButton) {
        exportButton.addEventListener("click", function () {

            const year = document.getElementById("allMarksYear").value;

            const semester = document.getElementById("allMarksSemester").value;

            const activeExam = document.querySelector(
                "#allMarksExamTabs .btn-primary"
            );

            const examType = activeExam?.dataset.exam || "First Internal";

            const params = new URLSearchParams({
                year,
                semester,
                exam_type: examType
            });

            window.location.href =
                `/api/faculty/class-marks/export?${params}`;
        });
    }
}


    if (viewId === "faculty-attendance") {
    initFacultyAttendance();
}
    if (viewId === "faculty-leave-approval") {
    loadFacultyLeaveApplications();
}
    if (viewId === "faculty-documents") {
    loadFacultyDocuments();
}
if (viewId === "faculty-notices") {
    initFacultyNotices();
}
if (viewId === "faculty-notes") {
    initFacultyNotes();
}
if (viewId === "faculty-student-voice") {
    initFacultyStudentVoice();
}
    if (viewId === "faculty-assignments") {
    loadAssignmentSubjects();
    loadFacultyAssignments();
    loadFacultySubmissionFilters();
}
    if (
    viewId === "faculty-dashboard" &&
    typeof loadFacultyTimetable === "function"
) {
    loadFacultyTimetable();
}

if (viewId === "faculty-department-timetables") {
    const yearSelect = document.getElementById(
        "departmentTimetableYear"
    );

    const semesterSelect = document.getElementById(
        "departmentTimetableSemester"
    );

    const sectionSelect = document.getElementById(
        "departmentTimetableSection"
    );

    if (yearSelect && semesterSelect && sectionSelect) {
        yearSelect.addEventListener("change", loadDepartmentTimetable);
        semesterSelect.addEventListener("change", loadDepartmentTimetable);
        sectionSelect.addEventListener("change", loadDepartmentTimetable);
    }
}


async function loadDepartmentTimetable() {
    const container = document.getElementById(
        "departmentTimetableContainer"
    );

    const yearSelect = document.getElementById(
        "departmentTimetableYear"
    );

    const semesterSelect = document.getElementById(
        "departmentTimetableSemester"
    );

    const sectionSelect = document.getElementById(
        "departmentTimetableSection"
    );

    if (!container || !yearSelect || !semesterSelect || !sectionSelect) {
        return;
    }

    const year = yearSelect.value;
    const semester = semesterSelect.value;
    const section = sectionSelect.value;

    if (!year || !semester || !section) {
        container.textContent =
            "Select a year, semester and section to view the timetable.";
        return;
    }

    container.textContent = "Loading department timetable...";

    try {
        const response = await fetch(
            "/api/faculty/department-timetables"
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const allEntries = await response.json();

        const entries = allEntries.filter(entry =>
            Number(entry.academic_year) === Number(year) &&
            Number(entry.semester) === Number(semester) &&
            String(entry.section).toUpperCase() === section.toUpperCase()
        );

        if (entries.length === 0) {
            container.textContent =
                "No timetable entries found for this class.";
            return;
        }

        const periods = [
            { number: 1, time: "8:30–9:15" },
            { number: 2, time: "9:15–10:00" },
            { number: 3, time: "10:00–10:45" },
            { number: 4, time: "11:00–11:45" },
            { number: 5, time: "11:45–12:30" },
            { number: 6, time: "12:30–1:15" },
            { number: 7, time: "2:00–2:45" },
            { number: 8, time: "2:45–3:30" },
            { number: 9, time: "3:45–4:35" }
        ];

        const days = [
            "Monday", "Tuesday", "Wednesday",
            "Thursday", "Friday", "Saturday"
        ];

        const table = document.createElement("table");
        table.className = "dashboard-timetable faculty-weekly-timetable";

        const thead = document.createElement("thead");

        const timeRow = document.createElement("tr");
        const firstHeading = document.createElement("th");
        firstHeading.textContent = "DAY / TIME";
        timeRow.appendChild(firstHeading);

        periods.forEach(period => {
            const th = document.createElement("th");
            th.textContent = period.time;
            timeRow.appendChild(th);
        });

        thead.appendChild(timeRow);

        const periodRow = document.createElement("tr");
        const periodHeading = document.createElement("th");
        periodHeading.textContent = "PERIOD";
        periodRow.appendChild(periodHeading);

        periods.forEach(period => {
            const th = document.createElement("th");
            th.textContent = period.number;
            periodRow.appendChild(th);
        });

        thead.appendChild(periodRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        days.forEach(day => {
            const row = document.createElement("tr");

            const dayCell = document.createElement("th");
            dayCell.scope = "row";
            dayCell.textContent = day.toUpperCase();
            row.appendChild(dayCell);

            periods.forEach(period => {
                const cell = document.createElement("td");

                const matches = entries.filter(entry =>
                    String(entry.day_of_week).toLowerCase() ===
                        day.toLowerCase() &&
                    Number(entry.period_number) === period.number
                );

                matches.forEach((entry, index) => {
                    if (index > 0) {
                        cell.appendChild(document.createElement("hr"));
                    }

                    const subject = document.createElement("strong");
                    subject.textContent = entry.subject_name || "Class";
                    cell.appendChild(subject);

                    const staff = document.createElement("small");
                    staff.textContent = entry.staff_name || "Staff not assigned";
                    cell.appendChild(staff);

                    if (entry.room_number) {
                        const room = document.createElement("small");
                        room.textContent = `Room ${entry.room_number}`;
                        cell.appendChild(room);
                    }
                });

                row.appendChild(cell);
            });

            tbody.appendChild(row);
        });

        table.appendChild(tbody);

        const wrapper = document.createElement("div");
        wrapper.className = "faculty-timetable-scroll";
        wrapper.appendChild(table);

        container.replaceChildren(wrapper);

    } catch (error) {
        console.error("Department timetable loading error:", error);
        container.textContent =
            "Unable to load department timetable. Please try again.";
    }
}

}
function initStudentVoice() {
    const feedbackForm = document.getElementById("student-feedback-form");
    const complaintForm = document.getElementById("student-complaint-form");
    const tabs = document.querySelectorAll("[data-voice-tab]");
    const message = document.getElementById("student-voice-message");

    if (!feedbackForm || !complaintForm || !message) return;

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const selectedTab = tab.dataset.voiceTab;

            document.querySelectorAll(".voice-panel").forEach(panel => {
                panel.hidden = true;
            });

            document.querySelectorAll(".voice-tab").forEach(button => {
                button.classList.remove("active");
            });

            const panel = document.getElementById(
                `voice-${selectedTab}-panel`
            );

            if (panel) panel.hidden = false;
            tab.classList.add("active");

            message.textContent = "";

            if (selectedTab === "history") {
                loadStudentVoiceHistory();
            }
        });
    });

    feedbackForm.addEventListener("submit", event => {
        event.preventDefault();
        submitStudentVoice(feedbackForm, "Feedback");
    });

    complaintForm.addEventListener("submit", event => {
        event.preventDefault();
        submitStudentVoice(complaintForm, "Complaint");
    });
}

async function submitStudentVoice(form, voiceType) {
    const message = document.getElementById("student-voice-message");
    const button = form.querySelector('button[type="submit"]');

    const data = Object.fromEntries(new FormData(form).entries());

    data.voice_type = voiceType;
    data.is_anonymous = form.querySelector(
        '[name="is_anonymous"]'
    ).checked;

    message.textContent = "Submitting...";
    button.disabled = true;

    try {
        const response = await fetch("/api/student-voice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || result.error || "Submission failed.");
        }

        message.textContent =
            `${voiceType} submitted successfully!`;

        message.style.color = "green";
        form.reset();

        await loadStudentVoiceHistory();
    } catch (error) {
        message.textContent = error.message;
        message.style.color = "red";
    } finally {
        button.disabled = false;
    }
}

async function loadStudentVoiceHistory() {
    const container = document.getElementById("student-voice-history");

    if (!container) return;

    container.innerHTML = "<p>Loading submissions...</p>";

    try {
        const response = await fetch("/api/student-voice");
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || result.error || "Could not load submissions.");
        }

        const submissions = Array.isArray(result)
            ? result
            : result.submissions || [];

        if (!submissions.length) {
            container.innerHTML = "<p>You have no submissions yet.</p>";
            return;
        }

        const escapeHTML = value => String(value ?? "").replace(
            /[&<>"']/g,
            char => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[char]
        );

        container.innerHTML = submissions.map(item => `
            <article class="voice-submission">
                <h4>${escapeHTML(item.title)}</h4>
                <p><strong>Type:</strong> ${escapeHTML(item.voice_type)}</p>
                <p><strong>Category:</strong> ${escapeHTML(item.category)}</p>
                <p>${escapeHTML(item.description)}</p>
                <p><strong>Recipient:</strong> ${escapeHTML(item.target_audience)}</p>
                <p><strong>Status:</strong> ${escapeHTML(item.status)}</p>
                <p><strong>Date:</strong> ${
                    escapeHTML(item.created_at || "Not available")
                }</p>
            </article>
        `).join("");
    } catch (error) {
        container.innerHTML = `<p>${error.message}</p>`;
    }
}
/* =========================================================
   TEMPLATE RENDERING
   ========================================================= */

async function loadLeaveApplicationHistory() {
    const container = document.getElementById("leaveApplicationList");

    if (!container) return;

    container.innerHTML = `
        <p class="leave-history-loading">Loading applications...</p>
    `;

    try {
        const response = await fetch("/api/leave-applications", {
            method: "GET",
            credentials: "same-origin"
        });

        const applications = await response.json();

        if (!response.ok) {
            throw new Error(
                applications.error || "Unable to load applications."
            );
        }

        if (!Array.isArray(applications) || applications.length === 0) {
            container.innerHTML = `
                <div class="leave-history-placeholder">
                    <h4>No applications yet</h4>
                    <p>
                        Your submitted leave and OD applications
                        will appear here.
                    </p>
                </div>
            `;
            return;
        }

        // Sort newest submissions first
applications.sort((a, b) => {
    const dateA = new Date(a.applied_at).getTime();
    const dateB = new Date(b.applied_at).getTime();

    return dateB - dateA;
});

// Display numbers according to the sorted order
container.innerHTML = applications.map((item, index) => {
    const status = ["Pending", "Approved", "Rejected"]
        .includes(item.status)
        ? item.status
        : "Pending";

    const statusClass = status.toLowerCase();

    return `
        <article class="leave-history-item">
            <div class="leave-history-item-main">
                <div>
                    <h4>Application #${applications.length - index}</h4>
                    <p>
                        ${escapeLeaveText(item.from_date || "—")}
                        &ndash;
                        ${escapeLeaveText(item.to_date || "—")}
                    </p>
                </div>

                <span class="leave-status leave-status-${statusClass}">
                    ${status}
                </span>
            </div>

            <div class="leave-history-reason">
                <span>Reason</span>
                <p>${escapeLeaveText(item.reason || "Not provided")}</p>
            </div>

            <div class="leave-history-submitted">
                Submitted:
                ${escapeLeaveText(item.applied_at || "—")}
            </div>
        </article>
    `;
}).join("");

    } catch (error) {
        console.error("Leave history error:", error);

        container.innerHTML = `
            <div class="leave-history-error">
                Unable to load applications. Please refresh and try again.
            </div>
        `;
    }
}

function escapeLeaveText(value) {
    const element = document.createElement("span");
    element.textContent = String(value);
    return element.innerHTML;
}



async function loadFacultyLeaveApplications() {
    const message = document.getElementById(
        "facultyLeaveApplicationsMessage"
    );
    const container = document.getElementById(
        "facultyLeaveApplicationsList"
    );

    if (!message || !container) return;

    message.textContent = "Loading leave applications...";
    container.replaceChildren();

    try {
        const response = await fetch(
            "/api/faculty/leave-applications",
            {
                method: "GET",
                credentials: "same-origin"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Unable to load applications."
            );
        }

        const applications = Array.isArray(data)
            ? data
            : (data.applications || []);

        const newSinceLastVisit = data.new_since_last_visit || 0;

        // Show the new-application count
        const summary = document.createElement("div");
        summary.className = "card";
        summary.style.cssText =
            "padding:16px;margin-bottom:16px;";

        summary.className = "leave-summary-card";

summary.innerHTML = `
    <div>
        <p class="leave-summary-label">
            New since your last visit
        </p>
        <p class="leave-summary-count">
            ${Number(newSinceLastVisit)}
        </p>
    </div>
`;

        container.appendChild(summary);

        if (!Array.isArray(applications) || applications.length === 0) {
            message.textContent = "No leave applications found.";
            return;
        }

        message.textContent =
            `${applications.length} application(s) found.`;

        // Group applications by submission date
        const groupedApplications = {};

        applications.forEach(item => {
            const submitted = item.applied_at || "";
            const date = submitted
                ? submitted.split(",")[0]
                : "Submission date unavailable";

            if (!groupedApplications[date]) {
                groupedApplications[date] = [];
            }

            groupedApplications[date].push(item);
        });

        Object.entries(groupedApplications).forEach(
            ([date, items]) => {
                const group = document.createElement("section");
group.className = "leave-date-group";

const heading = document.createElement("div");
heading.className = "leave-date-heading";

heading.innerHTML = `
    <h3 class="leave-date-title">
        ${escapeLeaveText(date)}
    </h3>
    <span class="leave-date-count">
        ${items.length} application${items.length === 1 ? "" : "s"}
    </span>
`;

group.appendChild(heading);

                items.forEach(item => {
                    const status = ["Pending", "Approved", "Rejected"]
                        .includes(item.status)
                        ? item.status
                        : "Pending";

                    const card = document.createElement("article");
                    card.className = "card";
                    card.style.cssText =
                        "padding:18px;margin-top:12px;";

                    card.className = "leave-application-card";

card.innerHTML = `
    <div class="leave-application-header">
        <div>
            <h4 class="leave-student-name">
                ${escapeLeaveText(item.student_name || "Unknown Student")}
            </h4>
            <p class="leave-register-number">
                Register No.: ${escapeLeaveText(item.register_no || "—")}
            </p>
        </div>

        <span class="leave-status-badge leave-status-${status.toLowerCase()}">
            ${escapeLeaveText(status)}
        </span>
    </div>

    <div class="leave-application-details">
        <div>
            <span class="leave-detail-label">Application type</span>
            <div class="leave-detail-value">
                ${escapeLeaveText(item.application_type || "Leave")}
            </div>
        </div>

        <div>
            <span class="leave-detail-label">Leave dates</span>
            <div class="leave-detail-value">
                ${escapeLeaveText(item.from_date || "—")}
                &ndash;
                ${escapeLeaveText(item.to_date || "—")}
            </div>
        </div>

        <div class="leave-application-reason">
            <span class="leave-detail-label">Reason</span>
            <div class="leave-detail-value">
                ${escapeLeaveText(item.reason || "Not provided")}
            </div>
        </div>

        <div class="leave-application-submitted">
            Submitted: ${escapeLeaveText(item.applied_at || "—")}
        </div>
    </div>

    ${
        status === "Pending"
            ? `
                <div class="leave-application-actions">
                    <button
                        type="button"
                        class="leave-action-button leave-action-approve"
                        data-leave-id="${Number(item.leave_id)}"
                        data-leave-status="Approved">
                        Approve
                    </button>

                    <button
                        type="button"
                        class="leave-action-button leave-action-reject"
                        data-leave-id="${Number(item.leave_id)}"
                        data-leave-status="Rejected">
                        Reject
                    </button>
                </div>
            `
            : ""
    }
`;

                    group.appendChild(card);
                });

                container.appendChild(group);
            }
        );

    } catch (error) {
        console.error("Leave applications loading error:", error);
        message.textContent =
            error.message || "Unable to load leave applications.";
    }
}



async function reviewFacultyLeaveApplication(leaveId, status) {
    const action = status === "Approved" ? "approve" : "reject";

    if (!window.confirm(`Are you sure you want to ${action} this application?`)) {
        return;
    }

    try {
        const response = await fetch(
            `/api/faculty/leave-applications/${leaveId}`,
            {
                method: "PATCH",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error || "Unable to update application."
            );
        }

        await loadFacultyLeaveApplications();

    } catch (error) {
        window.alert(
            error.message || "Unable to process the application."
        );
    }
}

document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-leave-status]");

    if (!button) return;

    const leaveId = Number(button.dataset.leaveId);
    const status = button.dataset.leaveStatus;

    if (!Number.isInteger(leaveId) || leaveId <= 0) return;
    if (!["Approved", "Rejected"].includes(status)) return;

    reviewFacultyLeaveApplication(leaveId, status);
});



function renderTemplate(
    viewId,
    dept
) {

    /* =====================================================
       STUDENT DASHBOARD
       ===================================================== */

    if (viewId === "std-dashboard") {

        return `

            <!-- =============================================
                 IMPORTANT ANNOUNCEMENT
                 ============================================= -->

            <div
                class="dashboard-alert"
                onclick="
                    loadView(
                        'std-announcements',
                        'Announcements',
                        null
                    )
                "
                role="button"
                tabindex="0"
                title="Open Announcements"
            >

                <div class="dashboard-alert-icon">
                    !
                </div>


                <div class="dashboard-alert-content">

                    <div class="dashboard-alert-label">
                        Important Announcement
                    </div>


                    <div class="dashboard-alert-title">
                        Mid-Semester Examination Timetable Released
                    </div>


                    <div class="dashboard-alert-meta">
                        ${dept} · Open Announcements to view the full details
                    </div>

                </div>


                <div class="dashboard-alert-arrow">
                    →
                </div>

            </div>


            <!-- =============================================
                 ATTENDANCE + CGPA
                 ============================================= -->

            <div class="dashboard-summary-grid">


                <!-- ATTENDANCE -->

                <div class="card dashboard-summary-card">

                    <div>

                        <h3>
                            Attendance
                        </h3>


                        <div class="value">
                            88%
                        </div>

                    </div>


                    <div class="dashboard-summary-note">
                        Overall attendance
                    </div>

                </div>


                <!-- CGPA -->

                <div class="card dashboard-summary-card">

                    <div>

                        <h3>
                            CGPA
                        </h3>


                        <div class="value">
                            8.4
                        </div>

                    </div>


                    <div class="dashboard-summary-note">
                        Current cumulative GPA
                    </div>

                </div>

            </div>


            <!-- =============================================
                 WEEKLY TIMETABLE
                 ============================================= -->

            <div class="section-title">

                <h3
                    style="
                        font-family:var(--font-display);
                        font-size:16px;
                    "
                >
                    Weekly Timetable
                </h3>

            </div>


            
<div class="dashboard-table-wrapper" id="timetableContainer">
    <p>Loading timetable...</p>
</div>



            <!-- =============================================
                 DUE WORKS
                 ============================================= -->

            <div class="section-title">

                <h3
                    style="
                        font-family:var(--font-display);
                        font-size:16px;
                    "
                >
                    Due Works
                </h3>

            </div>


            <div class="grid dashboard-due-grid">


                <div class="card item-card">

                    <h4>
                        SQL Queries Practice
                    </h4>

                    <div class="meta">
                        Database Systems · Due 25 Oct
                    </div>

                </div>


                <div class="card item-card">

                    <h4>
                        Web Prototype
                    </h4>

                    <div class="meta">
                        Web Development · Due 28 Oct
                    </div>

                </div>


            </div>

        `;
    }


    /* =====================================================
       ANNOUNCEMENTS
       ===================================================== */

    if (viewId === "std-announcements") {

        return `

            <div class="grid">


                <div class="card item-card">

                    <h4>
                        Mid-Semester Examination Timetable Released
                    </h4>

                    <div class="meta">
                        ${dept} · Important
                    </div>

                </div>


                <div class="card item-card">

                    <h4>
                        Fee Payment Deadline Extended
                    </h4>

                    <div class="meta">
                        Institution-wide
                    </div>

                </div>


                <div class="card item-card">

                    <h4>
                        ${dept} Lab Reallocation
                    </h4>

                    <div class="meta">
                        ${dept} only
                    </div>

                </div>


            </div>

        `;
    }


    /* =====================================================
       NOTES
       ===================================================== */

    if (viewId === "std-notes") {
        return `
            <div class="section-title">
                <h3>Notes</h3>
            </div>
            <div id="notesContainer">
                <p style="color:var(--muted);font-size:13px;">Loading notes...</p>
            </div>
        `;
    }


    /* =====================================================
       ASSIGNMENTS
       ===================================================== */

    if (viewId === "std-assignments") {
        return `
            <div class="section-title">
                <h3>Assignments</h3>
            </div>
            <div id="assignmentsContainer">
                <p style="color:var(--muted);font-size:13px;">Loading assignments...</p>
            </div>
    <div class="section-title" style="margin-top:28px;">
    <h3>My Submissions</h3>
</div>

<div id="mySubmissionsContainer">
    <p style="color:var(--muted);font-size:13px;">
        Loading submission history...
    </p>
</div>
        `;
    }


    /* =====================================================
       ATTENDANCE
       ===================================================== */

    if (viewId === "std-attendance") {
        return `
            <div class="section-title">
                <h3>Attendance</h3>
            </div>
            <div id="attendanceContainer">
                <p style="color:var(--muted);font-size:13px;">Loading attendance...</p>
            </div>
        `;
    }

       
    if (viewId === "std-documents") {
        return `
            <div class="section-title">
                <h3>My Documents</h3>
                <p style="color:var(--muted);font-size:13px;">
                    Upload and manage your documents.
                </p>
            </div>

            <div class="card" style="padding:20px;">
                <form id="studentDocumentForm">
                    <div style="margin-bottom:15px;">
                        <label for="documentName">Document Name</label>
                        <input
                            type="text"
                            id="documentName"
                            name="document_name"
                            placeholder="e.g. 12th Marksheet"
                            required
                        >
                    </div>

                    <div style="margin-bottom:15px;">
                        <label for="documentType">Document Type</label>
                        <select
                            id="documentType"
                            name="document_type"
                            required
                        >
                            <option value="">Select type</option>
                            <option value="Identity proof">Identity proof</option>
                            <option value="Academic record">Academic record</option>
                            <option value="Address proof">Address proof</option>
                            <option value="Address proof">Address proof</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div style="margin-bottom:15px;">
                        <label for="documentFile">Choose Document</label>
                        <input
                            type="file"
                            id="documentFile"
                            name="document_file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                        >
                        <p id="selectedFileName"
   style="color:var(--muted);font-size:13px;">
    No file selected
</p>
                        <p style="color:var(--muted);font-size:12px;">
                            Accepted formats: PDF, JPG and PNG.
                        </p>
                    </div>

                    <button type="submit" class="btn btn-primary">
                        Upload Document
                    </button>

                    <p id="documentMessage" role="status"></p>
                </form>
            </div>

            <div class="section-title" style="margin-top:24px;">
                <h3>My Uploaded Documents</h3>
            </div>

            <div id="studentDocumentsContainer">
                <p style="color:var(--muted);font-size:13px;">
                    No documents loaded yet.
                </p>
            </div>
        `;
    }

    /* =====================================================
       MARKS
       ===================================================== */

    if (viewId === "std-marks") {
    return `
        <div class="section-title">
            <h3>My Marks</h3>
            <p style="color:var(--muted);font-size:13px;">
                View your published examination results.
            </p>
        </div>

        <div id="studentMarksContainer">
            <p style="color:var(--muted);font-size:13px;">
                Loading marks...
            </p>
        </div>
    `;
}

    /* =====================================================
       STUDENT VOICE
       ===================================================== */

    
if (viewId === "std-voice") {
    return `
        <div class="section-title">
            <h3>Student Voice</h3>
            <p>Share your feedback and raise concerns.</p>
        </div>

        <div class="student-voice-container">

            <div class="student-voice-tabs">
                <button class="voice-tab active" data-voice-tab="feedback">
                    Submit Feedback
                </button>

                <button class="voice-tab" data-voice-tab="complaint">
                    Raise Complaint
                </button>

                <button class="voice-tab" data-voice-tab="history">
                    My Submissions
                </button>
            </div>

            <div id="voice-feedback-panel" class="voice-panel">
                <form id="student-feedback-form">
                    <label for="feedback-category">Category</label>
                    <select id="feedback-category" name="category" required>
                        <option value="">Select category</option>
                        <option value="Teaching">Teaching</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Academics">Academics</option>
                        <option value="Hostel">Hostel</option>
                        <option value="Other">Other</option>
                    </select>

                    <label for="feedback-title">Title</label>
                    <input
                        id="feedback-title"
                        name="title"
                        type="text"
                        maxlength="150"
                        placeholder="Enter a short title"
                        required
                    >

                    <label for="feedback-description">Feedback</label>
                    <textarea
                        id="feedback-description"
                        name="description"
                        rows="5"
                        placeholder="Write your feedback..."
                        required
                    ></textarea>

                    <label for="feedback-target">Send to</label>
                    <select id="feedback-target" name="target_audience" required>
                        <option value="">Select recipient</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Class Advisor">Class Advisor</option>
                        <option value="Administration">Administration</option>
                    </select>

                    <label class="voice-anonymous-option">
                        <input
                            type="checkbox"
                            name="is_anonymous"
                            value="true"
                        >
                        Submit anonymously
                    </label>

                    <button type="submit" class="primary-btn">
                        Submit Feedback
                    </button>
                </form>
            </div>

            <div id="voice-complaint-panel" class="voice-panel" hidden>
                <form id="student-complaint-form">
                    <label for="complaint-category">Category</label>
                    <select id="complaint-category" name="category" required>
                        <option value="">Select category</option>
                        <option value="Teaching">Teaching</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Academics">Academics</option>
                        <option value="Hostel">Hostel</option>
                        <option value="Other">Other</option>
                    </select>

                    <label for="complaint-title">Title</label>
                    <input
                        id="complaint-title"
                        name="title"
                        type="text"
                        maxlength="150"
                        placeholder="Enter a short title"
                        required
                    >

                    <label for="complaint-description">Complaint details</label>
                    <textarea
                        id="complaint-description"
                        name="description"
                        rows="5"
                        placeholder="Describe the issue..."
                        required
                    ></textarea>

                    <label for="complaint-target">Send to</label>
                    <select id="complaint-target" name="target_audience" required>
                        <option value="">Select recipient</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Class Advisor">Class Advisor</option>
                        <option value="Administration">Administration</option>
                    </select>

                    <label class="voice-anonymous-option">
                        <input
                            type="checkbox"
                            name="is_anonymous"
                            value="true"
                        >
                        Submit anonymously
                    </label>

                    <button type="submit" class="primary-btn">
                        Submit Complaint
                    </button>
                </form>
            </div>

            <div id="voice-history-panel" class="voice-panel" hidden>
                <h4>My Submissions</h4>
                <div id="student-voice-history">
                    <p>Your submissions will appear here.</p>
                </div>
            </div>

            <p id="student-voice-message" role="status"></p>
        </div>
    `;
}



    /* =====================================================
       LEAVE APPLICATION
       ===================================================== */

    

if (viewId === "std-leave") {
    return `
        <div class="leave-page">

            <div class="leave-page-header">
                <div>
                    <h2>Leave Application</h2>
                    <p>Submit a request and manage your applications.</p>
                </div>
                <span class="leave-header-tag">STUDENT PORTAL</span>
            </div>

            <div class="leave-info-banner">
                <div class="leave-info-icon">i</div>
                <div>
                    <h4>Before you submit</h4>
                    <p>Check your dates and provide a clear reason.
                    Attach supporting documents when applicable.</p>
                </div>
            </div>

            <div class="leave-form-card">
                <div class="leave-card-heading">
                    <div>
                        <h3>New Application</h3>
                        <p>Enter the details for your request below.</p>
                    </div>
                    <span class="leave-required-note">
                        * Required fields
                    </span>
                </div>

                <form id="leaveApplicationForm">

                    <div class="leave-form-grid">

                        <div class="leave-field">
                            <label for="application_type">
                                Application Type <span>*</span>
                            </label>
                            <select id="application_type"
                                    name="application_type" required>
                                <option value="Leave">Leave</option>
                                <option value="OD">On Duty (OD)</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div class="leave-field">
                            <label for="from_date">
                                From Date <span>*</span>
                            </label>
                            <input type="date" id="from_date"
                                   name="from_date" required>
                        </div>

                        <div class="leave-field">
                            <label for="to_date">
                                To Date <span>*</span>
                            </label>
                            <input type="date" id="to_date"
                                   name="to_date" required>
                        </div>

                        <div class="leave-field leave-full-width">
                            <label for="reason">
                                Reason for Application <span>*</span>
                            </label>
                            <textarea id="reason" name="reason"
                                      rows="4" required
                                      placeholder="Explain the reason for your application..."></textarea>
                            <small>Provide enough detail for your application
                            to be reviewed.</small>
                        </div>

                        <div class="leave-field leave-full-width">
                            <label for="document">
                                Supporting Document
                            </label>
                            <input type="file" id="document"
                                   name="document"
                                   accept=".pdf,.jpg,.jpeg,.png">
                            <small>Optional. PDF, JPG, JPEG or PNG.</small>
                        </div>

                    </div>

                    <div id="leaveMessage"
                         class="leave-message"
                         role="status"></div>

                    <div class="leave-form-actions">
                        <button type="reset"
                                class="leave-btn-secondary">
                            Clear Form
                        </button>
                        <button type="submit"
                                class="leave-btn-primary">
                            Submit Application
                            <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                
                </form>
            </div>
            

            <div class="leave-history-card">
                <div class="leave-card-heading">
                    <div>
                        <h3>Application History</h3>
                        <p>Review the status of your submitted requests.</p>
                    </div>
                </div>

                <div id="leaveApplicationList">
    <p>Loading applications...</p>
</div>
            </div>

        </div>

    `;
    
    }




    /* =====================================================
       FACULTY DASHBOARD
       ===================================================== */

    
if (viewId === "faculty-dashboard") {
    return `
        <div class="section-title">
            <h3>Faculty Dashboard</h3>
        </div>

        <div class="section-title">
            <h3>My Teaching Timetable</h3>
        </div>

        <div class="dashboard-table-wrapper"
             id="facultyTimetableContainer">
            <p>Loading your timetable...</p>
        </div>
    `;
}
    if (viewId === "faculty-leave-approval") {
    return `
        <div class="section-title">
            <h3>Leave Approval</h3>
            <p style="color:var(--muted);font-size:13px;">
                Review student leave applications and approve or reject them.
            </p>
        </div>

        
<div class="leave-approval-page">
    <div class="leave-approval-panel">
        <div
            id="facultyLeaveApplicationsMessage"
            class="leave-approval-message"
            role="status"
        >
            Loading leave applications...
        </div>

        <div id="facultyLeaveApplicationsList"></div>
    </div>
</div>

    `;
}

    if (viewId === "faculty-marks") {
        return `
        <div class="marks-page">

            <div class="marks-page-header">
                <div>
                    <p class="marks-eyebrow">ACADEMIC MANAGEMENT</p>
                    <h2>Marks Entry</h2>
                    <p class="marks-subtitle">
                        Enter, review and manage student examination marks.
                    </p>
                </div>
                
            </div>

            
                


            <div class="marks-form-card">
                <div class="marks-card-heading">
                    <div>
                        <h3>Student Assessment</h3>
                        <p>Enter the details carefully before submitting.</p>
                    </div>
                    
                </div>

                
<form id="marksEntryForm">

    <div class="marks-form-grid">
        <div class="marks-field">
            <label for="marksSubject">Subject</label>
            <select id="marksSubject" name="subject_id" required>
                <option value="">Select subject</option>
            </select>

        </div>


<div class="marks-field">
    <label for="marksAcademicYear">Academic Year</label>
    <select id="marksAcademicYear" name="academic_year" required>
        <option value="">Select year</option>
        <option value="1">Year 1</option>
        <option value="2">Year 2</option>
        <option value="3">Year 3</option>
        <option value="4">Year 4</option>
    </select>
</div>


<div class="marks-field">
    <label for="marksSection">Section</label>
    <select id="marksSection" name="section" required>
        <option value="">Select section</option>
        <option value="A">Section A</option>
        <option value="B">Section B</option>
        <option value="C">Section C</option>
        <option value="D">Section D</option>
        <option value="E">Section E</option>
    </select>
</div>

        <div class="marks-field">
            <label for="marksExamType">Examination Type</label>
            <select id="marksExamType" name="exam_type" required>
                <option value="">Select examination</option>
                <option value="First Internal">First Internal</option>
                <option value="Second Internal">Second Internal</option>
                <option value="Third Internal">Third Internal</option>
                <option value="Semester Examination">Semester Examination</option>
                <option value="Practical Examination">Practical Examination</option>
                <option value="Assignment">Assignment</option>
            </select>
        </div>

        <div class="marks-field">
            <label for="marksMaximum">Maximum Marks</label>
            <input
                type="number"
                id="marksMaximum"
                name="maximum_marks"
                placeholder="e.g. 100"
                min="0.01"
                step="0.01"
                value="100"
                required
            >
        </div>
    </div>

    <div class="marks-register-header">
        <div>
            <h3>Class Marks Register</h3>
            <p>Enter marks for each student in the selected class.</p>
        </div>
        <span id="marksStudentCount">0 students</span>
    </div>

    <div class="marks-register-wrapper">
        <table class="marks-register-table">
            <thead>
                <tr>
                    <th scope="col">S.No.</th>
                    <th scope="col">Register Number</th>
                    <th scope="col">Student Name</th>
                    <th scope="col">Marks Obtained</th>
                    <th scope="col">Percentage</th>
                </tr>
            </thead>
            <tbody id="marksStudentsBody">
                <tr>
                    <td colspan="5">Select a subject to load students.</td>
                </tr>
            </tbody>
        </table>
    </div>

<div class="marks-form-footer">
    <p
        id="marksEntryMessage"
        role="status"
        aria-live="polite">
    </p>

    <button
        type="submit"
        id="publishMarksButton"
        class="marks-submit-btn">
        Publish Marks
    </button>
</div>

</form>

            </div>
        </div>
    `;
}


if (viewId === "faculty-documents") {
    return `
        <div class="section-title">
            <h3>Student Documents</h3>
            <p style="color:var(--muted);font-size:13px;">
                View documents submitted by students in your assigned advisor class.
            </p>
        </div>

        <div class="card" style="padding:20px;">
            <div id="facultyDocumentsMessage"
                 role="status"
                 style="margin-bottom:15px;">
                Loading student documents...
            </div>

            <div id="facultyDocumentsContainer"></div>
        </div>
    `;
}

if (viewId === "faculty-attendance") {
    return `
        <div class="section-title">
            <h3>Attendance Management</h3>
            <p style="color:var(--muted);font-size:13px;">
                Manage overall class attendance and subject-wise attendance.
            </p>
        </div>

        <div class="card" style="padding:20px;">
            <div style="margin-bottom:20px;">
                <label for="attendanceType">Attendance Type</label>
                <select id="attendanceType" required>
                    <option value="">Select attendance type</option>
                    <option value="Overall">Overall Class Attendance</option>
                    <option value="Subject">Subject-wise Attendance</option>
                </select>
            </div>

            <div id="overallAttendanceFilters" style="display:none;">
                <h3>Class Advisor Attendance</h3>
                <p id="advisorClassInfo" style="color:var(--muted);"></p>
            </div>

            <div id="subjectAttendanceFilters" style="display:none;">
                <h3>Subject Attendance</h3>
                <div style="margin-bottom:15px;">
                    <label for="attendanceSubject">Select Subject</label>
                    <select id="attendanceSubject" required>
                        <option value="">Select a subject</option>
                    </select>
                </div>
            </div>

            <div style="margin-bottom:15px;">
                <label for="attendanceDate">Attendance Date</label>
                <input type="date" id="attendanceDate" required>
            </div>

            <button
                type="button"
                class="btn btn-primary"
                id="loadAttendanceStudents">
                Load Students
            </button>

            <div id="facultyAttendanceMessage"
                 role="status"
                 style="margin-top:12px;"></div>

            <div id="facultyAttendanceContainer"
                 style="margin-top:20px;">
                <p>Select an attendance type and date to continue.</p>
            </div>
        </div>
    `;
}


if (viewId === "faculty-assignments") {
    return `
        <div class="section-title">
            <h3>Assignments</h3>
            <p style="color:var(--muted);font-size:13px;">
                Upload and manage assignments for your assigned classes.
            </p>
        </div>

        <div class="card" style="padding:20px;">
            <h3>Upload Assignment</h3>

            <form id="facultyAssignmentForm">
                <div style="margin-bottom:15px;">
                    <label for="assignmentTitle">Assignment Title</label>
                    <input
                        type="text"
                        id="assignmentTitle"
                        name="title"
                        placeholder="Enter assignment title"
                        required
                    >
                </div>

                <div style="margin-bottom:15px;">
                    <label for="assignmentSubject">Subject</label>
                    <select id="assignmentSubject" name="subject_id" required>
                        <option value="">Select subject</option>
                    </select>
                </div>

                <div style="margin-bottom:15px;">
                    <label for="assignmentYear">Academic Year</label>
                    <select id="assignmentYear" name="academic_year" required>
                        <option value="">Select year</option>
                        <option value="1">Year 1</option>
                        <option value="2">Year 2</option>
                        <option value="3">Year 3</option>
                        <option value="4">Year 4</option>
                    </select>
                </div>

                <div style="margin-bottom:15px;">
                    <label for="assignmentSemester">Semester</label>
                    <select id="assignmentSemester" name="semester" required>
                        <option value="">Select semester</option>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                        <option value="5">Semester 5</option>
                        <option value="6">Semester 6</option>
                        <option value="7">Semester 7</option>
                        <option value="8">Semester 8</option>
                    </select>
                </div>

                <div style="margin-bottom:15px;">
                    <label for="assignmentSection">Section</label>
                    <select id="assignmentSection" name="section" required>
                        <option value="">Select section</option>
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                        <option value="D">Section D</option>
                        <option value="E">Section E</option>
                    </select>
                </div>

                <div style="margin-bottom:15px;">
                    <label for="assignmentDueDate">Due Date</label>
                    <input
                        type="date"
                        id="assignmentDueDate"
                        name="due_date"
                        required
                    >
                </div>

                <div style="margin-bottom:15px;">
                    <label for="assignmentFile">Assignment File</label>
                    <input
                        type="file"
                        id="assignmentFile"
                        name="assignment_file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                        required
                    >
                </div>

                <button type="submit" class="btn btn-primary">
                    Upload Assignment
                </button>

                <p id="facultyAssignmentMessage" role="status"></p>
            </form>
        </div>

        <div class="section-title" style="margin-top:24px;">
            <h3>Uploaded Assignments</h3>
        </div>

        <div class="card" style="padding:16px;margin-bottom:20px;">
    <h3>Filter Student Submissions</h3>

    <label for="filterYear">Year</label>
    <select id="filterYear" class="form-control">
        <option value="">Select Year</option>
    </select>

    <label for="filterSection" style="margin-top:12px;">
        Section
    </label>
    <select id="filterSection" class="form-control">
        <option value="">Select Section</option>
    </select>

    <label for="filterSubject" style="margin-top:12px;">
        Subject
    </label>
    <select id="filterSubject" class="form-control">
        <option value="">Select Subject</option>
    </select>

    <label for="filterAssignment" style="margin-top:12px;">
        Assignment
    </label>
    <select id="filterAssignment" class="form-control">
        <option value="">Select Assignment</option>
    </select>

    <button
        type="button"
        class="btn btn-primary"
        style="margin-top:16px;"
        onclick="loadFacultySubmissions()">
        Show Submissions
    </button>
</div>


        <div id="facultyAssignmentsContainer">
    <p>Loading assignments...</p>
</div>

<div id="facultySubmissionsContainer" style="display:none;">
</div>
    `;
}

if (viewId === "faculty-my-class") {
    return `
        <div class="section-title">
            <h3>My Class</h3>
            <p style="color:var(--muted);font-size:13px;">
                Manage your class documents and subject marks.
            </p>
        </div>

        <div class="card" style="padding:20px;">
            <h4>Student Documents</h4>
            <p>View documents submitted by students in your assigned class.</p>
            <button
                class="btn btn-primary"
                onclick="setActiveView('faculty-documents')">
                View Student Documents
            </button>
        </div>

        <div class="card" style="padding:20px;margin-top:16px;">
            <h4>All Subject Marks</h4>
            <p>View marks across subjects for students in your assigned class.</p>
            <button
                class="btn btn-primary"
                onclick="setActiveView('faculty-all-subject-marks')">
                View All Subject Marks
            </button>
        </div>
    `;
}


if (viewId === "faculty-all-subject-marks") {
    return `
        <div class="marks-page">

            <div class="marks-page-header">
                <div>
                    <p class="marks-eyebrow">ACADEMIC MANAGEMENT</p>
                    <h2>All Subject Marks</h2>
                    <p class="marks-subtitle">
                        View and manage marks across all subjects for your assigned class.
                    </p>
                </div>
            </div>

            <!-- Filter Section -->
            <div class="card" style="padding:20px;">

                <div class="marks-form-grid">

                    <!-- Academic Year -->
                    <div class="marks-field">
                        <label for="allMarksYear">Academic Year</label>
                        <select id="allMarksYear">
                            <option value="1">Year 1</option>
                            <option value="2" selected>Year 2</option>
                            <option value="3">Year 3</option>
                            <option value="4">Year 4</option>
                        </select>
                    </div>

                    <!-- Semester -->
                    <div class="marks-field">
                        <label for="allMarksSemester">Semester</label>
                        <select id="allMarksSemester">
                            <option value="3">Semester 3</option>
                            <option value="4" selected>Semester 4</option>
                        </select>
                    </div>


                </div>

                <p style="color:var(--muted);font-size:13px;margin-top:12px;">
    Select the academic year and semester to view the class marks worksheet.
</p>

            </div>

            <!-- Examination Tabs -->
            <div class="card" style="padding:20px;margin-top:16px;">

                <div id="allMarksExamTabs" class="marks-exam-tabs">

                    <button type="button"
                        class="btn btn-primary"
                        data-exam="First Internal">
                        First Internal
                    </button>

                    <button type="button"
                        class="btn btn-secondary"
                        data-exam="Second Internal">
                        Second Internal
                    </button>

                    <button type="button"
                        class="btn btn-secondary"
                        data-exam="Third Internal">
                        Third Internal
                    </button>

                    <button type="button"
                        class="btn btn-secondary"
                        data-exam="Semester Examination">
                        Semester
                    </button>
                    <button id="exportExcelBtn" class="btn btn-success">
    Open in Microsoft Excel
</button>
                </div>

                <!-- Marks Worksheet -->
                <div id="allMarksWorksheet" style="margin-top:20px;">
                    <p style="color:var(--muted);">
                        Select an academic year and semester to load the worksheet.
                    </p>
                </div>

            </div>

        </div>
    `;
}

    /* =====================================================
       ADMIN DASHBOARD
       ===================================================== */
    
    if (viewId === "faculty-timetable") {
        return `
            <div class="section-title">
                <h3>My Timetable</h3>
            </div>

            <div class="dashboard-table-wrapper"
                 id="facultyTimetableContainer">
                <p>Loading your timetable...</p>
            </div>
        `;
    }

    if (viewId === "faculty-department-timetables") {
        return `
            <div class="section-title">
                <h3>Department Timetables</h3>
            </div>

            <div class="marks-form-grid">
                <div class="marks-field">
                    <label for="departmentTimetableYear">
                        Academic Year
                    </label>
                    <select id="departmentTimetableYear">
                        <option value="">Select year</option>
                        <option value="1">Year 1</option>
                        <option value="2">Year 2</option>
                        <option value="3">Year 3</option>
                        <option value="4">Year 4</option>
                    </select>
                </div>

                <div class="marks-field">
                    <label for="departmentTimetableSemester">
                        Semester
                    </label>
                    <select id="departmentTimetableSemester">
                        <option value="">Select semester</option>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                        <option value="5">Semester 5</option>
                        <option value="6">Semester 6</option>
                        <option value="7">Semester 7</option>
                        <option value="8">Semester 8</option>
                    </select>
                </div>

                <div class="marks-field">
                    <label for="departmentTimetableSection">
                        Section
                    </label>
                    <select id="departmentTimetableSection">
                        <option value="">Select section</option>
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                        <option value="D">Section D</option>
                        <option value="E">Section E</option>
                    </select>
                </div>
            </div>

            <div class="dashboard-table-wrapper"
                 id="departmentTimetableContainer">
                <p>Select a year, semester and section to view the timetable.</p>
            </div>
        `;
    }

    
    if (viewId === "admin-dashboard") {

        return `

            <div class="section-title">

                <h3>
                    Admin Dashboard
                </h3>

            </div>


            <div class="empty-state">

                Admin dashboard content.

            </div>

        `;
    }
    if (viewId === "faculty-notices") {

    return `
        <div class="notices-page">

            <div class="notices-toolbar">

                <div class="notices-heading">
                    <span class="section-label">COMMUNICATION</span>
                    <h3>Notices</h3>
                    <p>
                        Create and manage notices for students
                        in your department.
                    </p>
                </div>

                <button
                    type="button"
                    class="notice-create-btn"
                    id="createNoticeBtn"
                >
                    <span>+</span>
                    Create Notice
                </button>

            </div>

            <div id="noticeFormContainer"></div>

            <div
                id="noticesList"
                class="notices-list"
            >
                <div class="notice-loading">
                    Loading notices...
                </div>
            </div>

        </div>
    `;
}
    if (viewId === "faculty-notes") {

    return `
        <div class="notices-page">

            <div class="notices-toolbar">

                <div class="notices-heading">
                    <span class="section-label">
                        ACADEMIC MATERIAL
                    </span>

                    <h3>Notes</h3>

                    <p>
                        Upload and manage study materials
                        for your assigned subjects.
                    </p>
                </div>

                <button
                    type="button"
                    class="notice-create-btn"
                    id="uploadNoteBtn"
                >
                    <span>+</span>
                    Upload Note
                </button>

            </div>

            <div id="noteFormContainer"></div>

            <div
                id="facultyNotesList"
                class="notices-list"
            >
                <div class="notice-loading">
                    Loading notes...
                </div>
            </div>

        </div>
    `;
}

if (viewId === "faculty-student-voice") {

    return `
        <div class="student-voice-staff-page">

            <div class="notices-toolbar">

                <div class="notices-heading">

                    <span class="section-label">
                        STUDENT COMMUNICATION
                    </span>

                    <h3>Student Voice</h3>

                    <p>
                        Review feedback and concerns submitted
                        by students in your department.
                    </p>

                </div>

            </div>

            <div
                id="facultyStudentVoiceList"
                class="faculty-voice-list"
            >
                <div class="notice-loading">
                    Loading student submissions...
                </div>
            </div>

        </div>
    `;
}

    /* =====================================================
       FALLBACK
       ===================================================== */

    return `

        <div class="empty-state">

            This page is not available yet.

        </div>

    `;
    
}

async function loadTimetable() {
    const container = document.getElementById("timetableContainer");

    if (!container) return;

    container.textContent = "Loading timetable...";

    try {
        const response = await fetch("/api/timetable");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const entries = await response.json();

        if (entries.length === 0) {
            container.textContent =
                "No timetable entries found for your class.";
            return;
        }

        const periods = [
            "8:30–9:15",
            "9:15–10:00",
            "10:00–10:45",
            "11:00–11:45",
            "11:45–12:30",
            "12:30–1:15",
            "2:00–2:45",
            "2:45–3:30",
            "3:45–4:35"
        ];

        const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];

        const table = document.createElement("table");
        table.className = "dashboard-timetable";

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        ["Day / Time", ...periods].forEach(label => {
            const th = document.createElement("th");
            th.textContent = label;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        days.forEach(day => {
            const row = document.createElement("tr");

            const dayCell = document.createElement("td");
            dayCell.textContent = day;
            row.appendChild(dayCell);

            for (let period = 1; period <= 9; period++) {
                const cell = document.createElement("td");

                const entry = entries.find(item =>
                    item.day_of_week === day &&
                    Number(item.period_number) === period
                );

                cell.textContent = entry
                    ? entry.subject_name
                    : "";

                row.appendChild(cell);
            }

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        container.replaceChildren(table);

    } catch (error) {
        console.error("Timetable loading error:", error);
        container.textContent =
            "Unable to load timetable. Please try again.";
    }
}



async function loadFacultyTimetable() {
    const container = document.getElementById(
        "facultyTimetableContainer"
    );

    if (!container) return;

    container.textContent = "Loading your timetable...";

    try {
        const response = await fetch("/api/faculty/timetable");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const entries = await response.json();

        if (entries.length === 0) {
            container.textContent = "No timetable entries found.";
            return;
        }

        const periods = [
            { number: 1, time: "8:30–9:15" },
            { number: 2, time: "9:15–10:00" },
            { number: 3, time: "10:00–10:45" },
            { number: 4, time: "11:00–11:45" },
            { number: 5, time: "11:45–12:30" },
            { number: 6, time: "12:30–1:15" },
            { number: 7, time: "2:00–2:45" },
            { number: 8, time: "2:45–3:30" },
            { number: 9, time: "3:45–4:35" }
        ];

        const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];

        const table = document.createElement("table");
        table.className = "dashboard-timetable faculty-weekly-timetable";

        const thead = document.createElement("thead");

        const timeRow = document.createElement("tr");
        const dayHeading = document.createElement("th");
        dayHeading.textContent = "DAY / TIME";
        timeRow.appendChild(dayHeading);

        periods.forEach(period => {
            const th = document.createElement("th");
            th.textContent = period.time;
            timeRow.appendChild(th);
        });

        thead.appendChild(timeRow);

        const periodRow = document.createElement("tr");
        const hourHeading = document.createElement("th");
        hourHeading.textContent = "PERIOD";
        periodRow.appendChild(hourHeading);

        periods.forEach(period => {
            const th = document.createElement("th");
            th.textContent = period.number;
            periodRow.appendChild(th);
        });

        thead.appendChild(periodRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        days.forEach(day => {
            const row = document.createElement("tr");

            const dayCell = document.createElement("th");
            dayCell.scope = "row";
            dayCell.textContent = day.toUpperCase();
            row.appendChild(dayCell);

            periods.forEach(period => {
                const cell = document.createElement("td");

                const matchingEntries = entries.filter(entry =>
                    entry.day_of_week?.toLowerCase() === day.toLowerCase() &&
                    Number(entry.period_number) === period.number
                );

                matchingEntries.forEach((entry, index) => {
                    if (index > 0) {
                        cell.appendChild(document.createElement("hr"));
                    }

                    const subject = document.createElement("strong");
                    subject.textContent = entry.subject_name || "Class";
                    cell.appendChild(subject);

                    const classInfo = document.createElement("small");
                    classInfo.textContent =
                        `Year ${entry.academic_year}, Sem ${entry.semester}, Section ${entry.section}`;
                    cell.appendChild(classInfo);

                    if (entry.room_number) {
                        const room = document.createElement("small");
                        room.textContent = `Room ${entry.room_number}`;
                        cell.appendChild(room);
                    }
                });

                row.appendChild(cell);
            });

            tbody.appendChild(row);
        });

        table.appendChild(tbody);

        const wrapper = document.createElement("div");
        wrapper.className = "faculty-timetable-scroll";
        wrapper.appendChild(table);

        container.replaceChildren(wrapper);

    } catch (error) {
        console.error("Faculty timetable loading error:", error);
        container.textContent =
            "Unable to load your timetable. Please try again.";
    }
}



/* =========================================================
   INITIALIZE
   ========================================================= */

renderNavigation();


loadView(
    currentRoleConfig.defaultView,
    "Dashboard",
    null
);

function seal(status) {
  const map = { approved: 'Approved', pending: 'Pending', rejected: 'Rejected' };
  return `<span class="seal seal-${status}">${map[status]}</span>`;
}

async function loadStudentNotes() {

    const container = document.getElementById("notesContainer");

    if (!container) {
        return;
    }

    try {

        const response = await fetch("/api/notes");
        const data = await response.json();

        if (!response.ok) {

            container.innerHTML = `
                <p style="color:red;">
                    ${data.error || "Unable to load notes."}
                </p>
            `;

            return;
        }

        if (data.length === 0) {

            container.innerHTML = `
                <div class="empty-state">
                    No notes available for your department.
                </div>
            `;

            return;
        }

        container.innerHTML = `
            <div class="grid">

                ${data.map(note => `

                    <div class="card item-card">

                        ${seal('approved')}

                        <h4>${note.title}</h4>

                        <div class="meta">
                            ${note.subject_name}
                            -+ ${note.subject_code}
                            -+ Semester ${note.semester}
                        </div>

                        <p style="
                            color:var(--muted);
                            font-size:13px;
                            margin-top:10px;
                        ">
                            ${note.description || ""}
                        </p>

                        ${
                            note.file_url
                            ? `
                                <div style="margin-top:12px;">
                                    <a
                                        href="${note.file_url}"
                                        target="_blank"
                                        class="btn btn-outline"
                                    >
                                        View / Download
                                    </a>
                                </div>
                            `
                            : ""
                        }

                        <div style="
                            color:var(--muted);
                            font-size:11px;
                            margin-top:10px;
                        ">
                            Uploaded: ${note.uploaded_at}
                        </div>

                    </div>

                `).join("")}

            </div>
        `;

    } catch (error) {

        console.error("Notes loading error:", error);

        container.innerHTML = `
            <p style="color:red;">
                Unable to connect to the server.
            </p>
        `;
    }
}


async function loadStudentDocuments() {
    const container = document.getElementById(
        "studentDocumentsContainer"
    );

    if (!container) return;

    container.textContent = "Loading documents...";

    try {
        const response = await fetch("/api/documents");
        const documents = await response.json();

        if (!response.ok) {
            throw new Error(
                documents.error || "Unable to load documents."
            );
        }

        if (documents.length === 0) {
            container.textContent = "No documents uploaded yet.";
            return;
        }

        
container.innerHTML = documents.map(doc => `
    <div class="card" style="padding:16px;margin-bottom:12px;">
        <h4>${doc.document_name}</h4>
        <p>Type: ${doc.document_type}</p>
        <p>File: ${doc.original_filename}</p>
        <p>Status: ${doc.status}</p>
        <p>Uploaded: ${doc.uploaded_at}</p>

        <a
            href="/api/documents/${doc.document_id}/download"
            class="btn btn-outline"
        >
            Download Document
        </a>
    </div>
`).join("");


    } catch (error) {
        console.error("Document loading error:", error);
        container.textContent = error.message;
    }
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
}

async function loadFacultyDocuments() {
    const message = document.getElementById("facultyDocumentsMessage");
    const container = document.getElementById("facultyDocumentsContainer");

    if (!message || !container) return;

    message.textContent = "Loading student documents...";
    container.innerHTML = "";

    try {
        const response = await fetch("/api/faculty/documents");
        const documents = await response.json();

        if (!response.ok) {
            throw new Error(
                documents.error || "Unable to load student documents."
            );
        }

        if (documents.length === 0) {
            message.textContent = "No documents found for your assigned class.";
            return;
        }

        message.textContent = `${documents.length} document(s) found.`;

        container.innerHTML = `
            <div style="overflow-x:auto;">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Register No.</th>
                            <th>Student Name</th>
                            <th>Document Name</th>
                            <th>Document Type</th>
                            <th>File</th>
                            <th>Status</th>
                            <th>Uploaded At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${documents.map(doc => `
                            <tr>
                                <td>${escapeHTML(doc.register_no || "")}</td>
                                <td>${escapeHTML(doc.student_name || "")}</td>
                                <td>${escapeHTML(doc.document_name || "")}</td>
                                <td>${escapeHTML(doc.document_type || "")}</td>
                                <td>
    <a
        href="/api/faculty/documents/${doc.document_id}/view"
        target="_blank"
        rel="noopener noreferrer">
        View
    </a>
    |
    <a
        href="/api/faculty/documents/${doc.document_id}/download">
        Download
    </a>
</td>
                                <td>${escapeHTML(doc.status || "")}</td>
                                <td>${escapeHTML(doc.uploaded_at || "")}</td>

<td>
    ${
        doc.status === "Pending"
            ? `
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button
                        type="button"
                        class="btn"
                        style="
                            background:#15803d;
                            color:#ffffff;
                            border:1px solid #15803d;
                            padding:8px 16px;
                            border-radius:6px;
                            font-weight:600;
                            cursor:pointer;
                        "
                        onclick="reviewFacultyDocument(${doc.document_id}, 'Accepted')">
                        Accept
                    </button>

                    <button
                        type="button"
                        class="btn"
                        style="
                            background:#ffffff;
                            color:#b91c1c;
                            border:1px solid #dc2626;
                            padding:8px 16px;
                            border-radius:6px;
                            font-weight:600;
                            cursor:pointer;
                        "
                        onclick="reviewFacultyDocument(${doc.document_id}, 'Rejected')">
                        Reject
                    </button>
                </div>
            `
            : `
                <span style="
                    display:inline-block;
                    padding:5px 10px;
                    border-radius:20px;
                    font-size:12px;
                    font-weight:600;
                    background:${doc.status === "Accepted" ? "#dcfce7" : "#fee2e2"};
                    color:${doc.status === "Accepted" ? "#166534" : "#991b1b"};
                ">
                    ${escapeHTML(doc.status || "")}
                </span>
            `
    }
</td>

                                    
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        message.textContent = error.message || "Unable to load student documents.";
    }
}

async function reviewFacultyDocument(documentId, status) {
    const action = status === "Accepted" ? "accept" : "reject";

    const confirmed = window.confirm(
        `Are you sure you want to ${action} this document?`
    );

    if (!confirmed) return;

    try {
        const response = await fetch(
            `/api/faculty/documents/${documentId}/review`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error || "Unable to review document."
            );
        }

        alert(result.message);

        await loadFacultyDocuments();

    } catch (error) {
        alert(error.message || "Unable to review document.");
    }
}

async function loadStudentAssignments() {

    const container =
        document.getElementById("assignmentsContainer");

    if (!container) {
        console.error("assignmentsContainer not found");
        return;
    }

    try {

        const response =
            await fetch("/api/assignments");

        const data =
            await response.json();

        console.log("Assignments received:", data);

        if (!response.ok) {

            container.innerHTML = `
                <p style="color:red;">
                    ${data.error || "Unable to load assignments."}
                </p>
            `;

            return;
        }

        if (data.length === 0) {

            container.innerHTML = `
                <div class="empty-state">
                    No assignments available for your department.
                </div>
            `;

            return;
        }

        container.innerHTML = `
            <div class="grid">

                ${data.map(assignment => `

                    <div class="card item-card">

                        ${seal('approved')}

                        <h4>${assignment.title}</h4>

                        <div class="meta">
                            ${assignment.subject_name}
                            -+ ${assignment.subject_code}
                            -+ Semester ${assignment.semester}
                        </div>

                        <p style="
                            color:var(--muted);
                            font-size:13px;
                            margin-top:10px;
                        ">
                            ${assignment.description || ""}
                        </p>

                        <div style="
                            margin-top:12px;
                            color:var(--muted);
                            font-size:12px;
                        ">
                            Due: ${assignment.due_date}
                        </div>

                        ${
                            assignment.file_url
                            ? `
                                <div style="margin-top:12px;">
                                    <a
                                        href="${assignment.file_url}"
                                        target="_blank"
                                        class="btn btn-outline"
                                    >
                                        View / Download
                                    </a>
                                </div>
                            `
                            : ""
                        }
                    <div style="margin-top:12px;">
    <input
        type="file"
        id="submission-file-${assignment.assignment_id}"
        accept=".pdf,.doc,.docx,.ppt,.pptx"
        style="display:none;"
    >

    <button
        type="button"
        class="btn"
        onclick="chooseAssignmentFile(${assignment.assignment_id})"
    >
        Submit Assignment
    </button>

    <p
        id="submission-status-${assignment.assignment_id}"
        style="margin-top:8px;font-size:12px;color:var(--muted);"
    ></p>
</div>
                    </div>
                

                `).join("")}

            </div>
        
        `;
        
    } catch (error) {

        console.error(
            "Assignments loading error:",
            error
        );

        container.innerHTML = `
            <p style="color:red;">
                Unable to connect to the server.
            </p>
        `;
    }
}


/* =========================
   STUDENT ATTENDANCE
   ========================= */

async function loadStudentAttendance() {

    const container =
        document.getElementById("attendanceContainer");

    if (!container) {
        console.error("attendanceContainer not found");
        return;
    }

    try {

        const response =
            await fetch("/api/attendance");

        const data =
            await response.json();

        console.log("Attendance received:", data);

        if (!response.ok) {

            container.innerHTML = `
                <p style="color:red;">
                    ${data.error || "Unable to load attendance."}
                </p>
            `;

            return;
        }

        if (data.records.length === 0) {

            container.innerHTML = `
                <div class="empty-state">
                    No attendance records available yet.
                </div>
            `;

            return;
        }

        container.innerHTML = `

            <div class="grid">

                <div class="card">
                    <h3>Overall Attendance</h3>
                    <div class="value">
                        ${data.overall.percentage}%
                    </div>
                </div>

                <div class="card">
                    <h3>Present Days</h3>
                    <div class="value">
                        ${data.overall.present}
                    </div>
                </div>

                <div class="card">
                    <h3>Total Classes</h3>
                    <div class="value">
                        ${data.overall.total}
                    </div>
                </div>

            </div>

            <h3 style="
                font-family:var(--font-display);
                font-size:16px;
                margin-top:24px;
            ">
                Subject-wise Attendance
            </h3>

            <table>

                <tr>
                    <th>Subject</th>
                    <th>Code</th>
                    <th>Present</th>
                    <th>Total</th>
                    <th>Percentage</th>
                </tr>

                ${data.subjects.map(subject => `

                    <tr>

                        <td>
                            ${subject.subject_name}
                        </td>

                        <td>
                            ${subject.subject_code}
                        </td>

                        <td>
                            ${subject.present}
                        </td>

                        <td>
                            ${subject.total}
                        </td>

                        <td>
                            ${subject.percentage}%
                        </td>

                    </tr>

                `).join("")}

            </table>

            <h3 style="
                font-family:var(--font-display);
                font-size:16px;
                margin-top:24px;
            ">
                Attendance History
            </h3>

            <table>

                <tr>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>

                ${data.records.map(record => `

                    <tr>

                        <td>
                            ${record.subject_name}
                            <div style="
                                color:var(--muted);
                                font-size:11px;
                            ">
                                ${record.subject_code}
                            </div>
                        </td>

                        <td>
                            ${record.date}
                        </td>

                        <td>
                            ${record.status}
                        </td>

                    </tr>

                `).join("")}

            </table>
        `;

    } catch (error) {

        console.error(
            "Attendance loading error:",
            error
        );

        container.innerHTML = `
            <p style="color:red;">
                Unable to connect to the server.
            </p>
        `;
    }
}


async function loadStudentMarks() {
    const container = document.getElementById(
        "studentMarksContainer"
    );

    if (!container) return;

    container.textContent = "Loading marks...";

    try {
        const response = await fetch("/api/student/marks");
        const marks = await response.json();

        console.log("Student marks API status:", response.status);
        console.log("Student marks API data:", marks);
       if (!response.ok) {
            throw new Error(
                marks.error || "Unable to load marks."
            );
        }

        if (marks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    No published marks are available yet.
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div style="overflow-x:auto;">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Subject Code</th>
                            <th>Examination</th>
                            <th>Marks Obtained</th>
                            <th>Percentage</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${marks.map(mark => `
                            <tr>
                                <td>${escapeHTML(mark.subject_name)}</td>
                                <td>${escapeHTML(mark.subject_code)}</td>
                                <td>${escapeHTML(mark.exam_type)}</td>
                                <td>
                                    ${mark.marks_obtained}
                                    / ${mark.maximum_marks}
                                </td>
                                <td>${mark.percentage}%</td>
                                <td>${escapeHTML(mark.created_at)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error("Student marks loading error:", error);

        container.textContent =
            error.message || "Unable to load marks.";
    }
}


async function loadFacultySubjects() {

    const subjectSelect = document.getElementById("marksSubject");

    if (!subjectSelect) {
        return;
    }

    subjectSelect.innerHTML = '<option value="">Loading subjects...</option>';

    try {
        const response = await fetch("/api/faculty/subjects");

        if (!response.ok) {
            throw new Error("Could not load subjects");
        }

        const subjects = await response.json();

        subjectSelect.innerHTML = '<option value="">Select subject</option>';

        if (subjects.length === 0) {
            subjectSelect.innerHTML = '<option value="">No assigned subjects</option>';
            return;
        }

        subjects.forEach(subject => {
            const option = document.createElement("option");
            option.value = subject.subject_id;
            option.textContent =
                `${subject.subject_code} - ${subject.subject_name} (Semester ${subject.semester ?? "N/A"})`;

            subjectSelect.appendChild(option);
        });


    } catch (error) {
        console.error("Assignment subjects error:", error);

        subjectSelect.innerHTML =
            '<option value="">Failed to load subjects</option>';
    }
}



async function loadAssignmentSubjects() {
    const subjectSelect =
        document.getElementById("assignmentSubject");

    if (!subjectSelect) return;

    subjectSelect.innerHTML =
        '<option value="">Loading subjects...</option>';

    try {
        const response = await fetch("/api/faculty/subjects");
        const subjects = await response.json();

        if (!response.ok) {
            throw new Error(
                subjects.error || "Unable to load subjects."
            );
        }

        subjectSelect.innerHTML =
            '<option value="">Select subject</option>';

        if (subjects.length === 0) {
            subjectSelect.innerHTML =
                '<option value="">No assigned subjects</option>';
            return;
        }

        subjects.forEach(subject => {
            const option = document.createElement("option");
            option.value = subject.subject_id;
            option.textContent =
                `${subject.subject_code} - ${subject.subject_name}`;

            subjectSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Assignment subjects error:", error);

        subjectSelect.innerHTML =
            '<option value="">Failed to load subjects</option>';
    }
}



async function loadFacultyAssignments() {
    const container = document.getElementById(
        "facultyAssignmentsContainer"
    );

    const assignmentSelect = document.getElementById(
        "filterAssignment"
    );

    if (!container || !assignmentSelect) return;

    const assignmentId = assignmentSelect.value;

    if (!assignmentId) {
        container.textContent = "Select an assignment to view it.";
        return;
    }

    container.textContent = "Loading assignment...";

    try {
        const subjectId = document.getElementById("filterSubject").value;

        const response = await fetch(
            `/api/faculty/subject-assignments/${subjectId}`
        );

        const assignments = await response.json();

        if (!response.ok) {
            throw new Error(
                assignments.error || "Unable to load assignment."
            );
        }

        const assignment = assignments.find(
            item => String(item.assignment_id) === String(assignmentId)
        );

        if (!assignment) {
            container.textContent = "Selected assignment not found.";
            return;
        }

        container.innerHTML = `
            <div class="card" style="padding:16px;margin-bottom:12px;">
                <h4>${assignment.title}</h4>
                <p>Subject: ${assignment.subject_name || "N/A"}</p>
                <p>Due date: ${assignment.due_date || "N/A"}</p>
                ${
                    assignment.file_url
                        ? `<a href="${assignment.file_url}"
                              target="_blank"
                              rel="noopener noreferrer">
                              View / Download
                           </a>`
                        : "<p>No file link available.</p>"
                }
            </div>
        `;

    } catch (error) {
        console.error("Faculty assignment error:", error);
        container.textContent = error.message;
    }
}


async function loadFacultySubmissions() {
    const container = document.getElementById(
        "facultySubmissionsContainer"
    );

    const year = document.getElementById("filterYear").value;
    const section = document.getElementById("filterSection").value;
    const subjectId = document.getElementById("filterSubject").value;
    const assignmentId = document.getElementById("filterAssignment").value;

    if (!year || !section || !subjectId || !assignmentId) {
        alert("Please select Year, Section, Subject, and Assignment.");
        return;
    }

    container.style.display = "block";
    container.textContent = "Loading student submissions...";

    try {
        const params = new URLSearchParams({
            year,
            section,
            subject_id: subjectId,
            assignment_id: assignmentId
        });

        const response = await fetch(
            `/api/faculty/assignment-submissions?${params.toString()}`
        );

        const submissions = await response.json();

        if (!response.ok) {
            throw new Error(
                submissions.error || "Unable to load submissions."
            );
        }

        if (submissions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    No submissions found for the selected filters.
                </div>
            `;
            return;
        }

        container.innerHTML = submissions.map(item => `
            <div class="card" style="padding:20px;margin-bottom:16px;">
                <h4>${escapeHTML(item.assignment_title)}</h4>

                <p>Subject: ${escapeHTML(item.subject_name || "")}</p>
                <p>Student: ${escapeHTML(item.student_name || "")}</p>
                <p>Register No.: ${escapeHTML(item.register_no || "")}</p>
                <p>File: ${escapeHTML(item.original_filename || "")}</p>
                <p>Submitted: ${escapeHTML(item.submitted_at || "")}</p>

                <p>
                    Status:
                    <span class="submission-status">
                        ${escapeHTML(item.status || "Submitted")}
                    </span>
                </p>

                <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;">
                    <a
                        href="/api/assignment-submissions/${item.submission_id}/view"
                        class="btn btn-outline"
                        target="_blank"
                        rel="noopener noreferrer">
                        View Submission
                    </a>

                    <a
                        href="/api/assignment-submissions/${item.submission_id}/download"
                        class="btn btn-primary">
                        Download Submission
                    </a>
                </div>
            </div>
        `).join("");

    } catch (error) {
        console.error("Faculty submissions error:", error);
        container.textContent =
            error.message || "Unable to load student submissions.";
    }
}

async function loadFacultySubmissionFilters() {
    const yearSelect = document.getElementById("filterYear");
    const sectionSelect = document.getElementById("filterSection");
    const subjectSelect = document.getElementById("filterSubject");

    if (!yearSelect || !sectionSelect || !subjectSelect) return;

    try {
        const response = await fetch("/api/faculty/submission-filters");
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to load filters.");
        }

        yearSelect.innerHTML = `
            <option value="">Select Year</option>
            ${data.years.map(year =>
                `<option value="${year}">${year}</option>`
            ).join("")}
        `;

        sectionSelect.innerHTML = `
            <option value="">Select Section</option>
            ${data.sections.map(section =>
                `<option value="${section}">${section}</option>`
            ).join("")}
        `;

        subjectSelect.innerHTML = `
            <option value="">Select Subject</option>
            ${data.subjects.map(subject =>
                `<option value="${subject.subject_id}">
                    ${subject.subject_name}
                </option>`
            ).join("")}
        `;
        document.getElementById("filterAssignment").addEventListener(
    "change",
    loadFacultyAssignments
);

    } catch (error) {
        console.error("Faculty filter error:", error);
        yearSelect.innerHTML = `<option value="">Unable to load filters</option>`;
    }
    subjectSelect.addEventListener(
    "change",
    loadFacultyFilterAssignments
);
}

async function loadFacultyFilterAssignments() {
    const subjectSelect = document.getElementById("filterSubject");
    const assignmentSelect = document.getElementById("filterAssignment");

    if (!subjectSelect || !assignmentSelect) return;

    const subjectId = subjectSelect.value;

    assignmentSelect.innerHTML =
        '<option value="">Select Assignment</option>';

    if (!subjectId) return;

    try {
        const response = await fetch(
            `/api/faculty/subject-assignments/${subjectId}`
        );

        const assignments = await response.json();

        if (!response.ok) {
            throw new Error(
                assignments.error || "Unable to load assignments."
            );
        }

        assignmentSelect.innerHTML = `
            <option value="">Select Assignment</option>
            ${assignments.map(item => `
                <option value="${item.assignment_id}">
                    ${item.title}
                </option>
            `).join("")}
        `;

    } catch (error) {
        console.error("Assignment filter error:", error);
        assignmentSelect.innerHTML =
            '<option value="">Unable to load assignments</option>';
    }
}




async function chooseAssignmentFile(assignmentId) {
    const fileInput = document.getElementById(
        `submission-file-${assignmentId}`
    );

    if (!fileInput) {
        console.error("Submission file input not found.");
        return;
    }

    fileInput.click();

    fileInput.onchange = async function () {
        const file = fileInput.files[0];

        if (!file) return;

        const status = document.getElementById(
            `submission-status-${assignmentId}`
        );

        const allowedExtensions = [
            "pdf", "doc", "docx", "ppt", "pptx"
        ];

        const extension = file.name.split(".").pop().toLowerCase();

        if (!allowedExtensions.includes(extension)) {
            status.textContent =
                "Choose a PDF, DOC, DOCX, PPT or PPTX file.";
            fileInput.value = "";
            return;
        }

        const formData = new FormData();
        formData.append("assignment_id", assignmentId);
        formData.append("submission_file", file);

        status.textContent = "Uploading submission...";

        try {
            const response = await fetch(
                "/api/assignment-submissions",
                {
                    method: "POST",
                    body: formData
                }
            );

            const result = await response.json();

            if (!response.ok) {
                status.textContent =
                    result.error || "Submission failed.";
                return;
            }

            status.textContent =
                "Assignment submitted successfully.";

            fileInput.value = "";

        } catch (error) {
            console.error("Submission error:", error);
            status.textContent =
                "Unable to connect to the server.";
        }
    };
}


async function loadFacultyMarksStudents() {
    const subjectSelect = document.getElementById("marksSubject");
    const tbody = document.getElementById("marksStudentsBody");
    const count = document.getElementById("marksStudentCount");
    const message = document.getElementById("marksEntryMessage");

    const yearSelect = document.getElementById("marksAcademicYear");
    const sectionSelect = document.getElementById("marksSection");
    const examSelect = document.getElementById("marksExamType");
    const maximumInput = document.getElementById("marksMaximum");

    if (!subjectSelect || !tbody) return;

    const subjectId = subjectSelect.value;
    const academicYear = yearSelect?.value;
    const section = sectionSelect?.value;
    const examType = examSelect?.value;

    tbody.replaceChildren();

    if (!subjectId || !academicYear || !section || !examType) {
        const row = tbody.insertRow();
        const cell = row.insertCell();

        cell.colSpan = 5;
        cell.textContent =
            "Select a subject, year, section and examination to load marks.";

        if (count) count.textContent = "0 students";
        if (message) message.textContent = "";

        return;
    }

    const loadingRow = tbody.insertRow();
    const loadingCell = loadingRow.insertCell();

    loadingCell.colSpan = 5;
    loadingCell.textContent = "Loading students and saved marks...";

    try {
        const params = new URLSearchParams({
            subject_id: subjectId,
            academic_year: academicYear,
            section: section
        });

        const studentsResponse = await fetch(
            `/api/faculty/marks/students?${params}`
        );

        const students = await studentsResponse.json();

        if (!studentsResponse.ok) {
            throw new Error(
                students.error || "Unable to load students."
            );
        }

        const marksParams = new URLSearchParams({
            subject_id: subjectId,
            academic_year: academicYear,
            section: section,
            exam_type: examType
        });

        const marksResponse = await fetch(
            `/api/faculty/marks/existing?${marksParams}`
        );

        const savedMarks = await marksResponse.json();

        if (!marksResponse.ok) {
            throw new Error(
                savedMarks.error || "Unable to load saved marks."
            );
        }

        const marksByStudent = new Map(
            savedMarks.map(mark => [
                Number(mark.student_id),
                mark
            ])
        );

        tbody.replaceChildren();

        if (count) {
            count.textContent =
                `${students.length} student${students.length === 1 ? "" : "s"}`;
        }

        const existingMarks = savedMarks[0];

        if (existingMarks && maximumInput) {
            maximumInput.value = existingMarks.maximum_marks;
        }

        if (students.length === 0) {
            const row = tbody.insertRow();
            const cell = row.insertCell();

            cell.colSpan = 5;
            cell.textContent = "No students found for this class.";

            return;
        }

        students.forEach((student, index) => {
            const row = tbody.insertRow();

            row.insertCell().textContent = index + 1;
            row.insertCell().textContent = student.register_no;
            row.insertCell().textContent = student.student_name;

            const marksCell = row.insertCell();
            const input = document.createElement("input");
            const savedMark = marksByStudent.get(
                Number(student.student_id)
            );

            input.type = "number";
            input.min = "0";
            input.step = "0.01";
            input.required = true;
            input.placeholder = "Enter marks";
            input.className = "marks-student-input";
            input.dataset.studentId = student.student_id;

            if (savedMark) {
                input.value = savedMark.marks_obtained;
                input.dataset.published = String(savedMark.is_published);
            } else {
                input.dataset.published = "false";
            }

            marksCell.appendChild(input);

            const percentageCell = row.insertCell();

            function updatePercentage() {
                const maximum = Number(maximumInput?.value);
                const obtained = Number(input.value);

                if (
                    input.value.trim() === "" ||
                    maximum <= 0 ||
                    obtained < 0 ||
                    obtained > maximum
                ) {
                    percentageCell.textContent = "—";
                    input.setCustomValidity(
                        obtained > maximum && maximum > 0
                            ? "Marks cannot exceed maximum marks."
                            : ""
                    );
                    return;
                }

                input.setCustomValidity("");

                percentageCell.textContent =
                    `${(obtained / maximum * 100).toFixed(1)}%`;
            }

            input.addEventListener("input", updatePercentage);
            maximumInput?.addEventListener("input", updatePercentage);

            updatePercentage();
        });

        if (message) {
            message.textContent = savedMarks.length
                ? `Loaded ${savedMarks.length} previously saved mark record(s).`
                : "";
        }

    } catch (error) {
        console.error("Marks register loading error:", error);

        tbody.replaceChildren();

        const row = tbody.insertRow();
        const cell = row.insertCell();

        cell.colSpan = 5;
        cell.textContent = error.message ||
            "Unable to load students and marks.";

        if (count) count.textContent = "0 students";
    }
}

document.addEventListener("change", function (event) {
    if (
        event.target.id === "marksSubject" ||
        event.target.id === "marksAcademicYear" ||
        event.target.id === "marksSection" ||
        event.target.id === "marksExamType"
    ) {
        loadFacultyMarksStudents();
    }
});

async function loadMySubmissions() {
    const container = document.getElementById(
        "mySubmissionsContainer"
    );

    if (!container) return;

    container.textContent = "Loading submission history...";

    try {
        const response = await fetch("/api/assignment-submissions");
        const submissions = await response.json();

        if (!response.ok) {
            throw new Error(
                submissions.error || "Unable to load submissions."
            );
        }

        if (submissions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    You haven't submitted any assignments yet.
                </div>
            `;
            return;
        }

        container.innerHTML = submissions.map(item => `
    <div class="card" style="padding:16px;margin-bottom:12px;">
        <h4>${item.assignment_title}</h4>

        <p style="margin-top:8px;">
            File: ${item.original_filename}
        </p>

        <p>
            Submitted: ${item.submitted_at}
        </p>

        <p>
            Status: ${item.status}
        </p>

        
<div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap;">
    <a
        href="/api/assignment-submissions/${item.submission_id}/view"
        class="btn btn-outline"
        target="_blank"
        rel="noopener noreferrer">
        View Submission
    </a>

    <a
        href="/api/assignment-submissions/${item.submission_id}/download"
        class="btn btn-outline">
        Download Submission
    </a>
</div>

    </div>
`).join("");

    } catch (error) {
        console.error("Submission history error:", error);

        container.textContent =
            "Unable to load submission history. Please try again.";
    }
}


document.addEventListener("submit", async function (event) {
    if (event.target.id !== "marksEntryForm") return;

    event.preventDefault();

    const form = event.target;
    const message = document.getElementById("marksEntryMessage");
    const submitButton = form.querySelector('button[type="submit"]');

    const subjectId = document.getElementById("marksSubject").value;
    const academicYear = document.getElementById("marksAcademicYear").value;
    const section = document.getElementById("marksSection").value;
    const examType = document.getElementById("marksExamType").value;
    const maximumMarks = Number(
        document.getElementById("marksMaximum").value
    );

    const inputs = [
        ...document.querySelectorAll(".marks-student-input")
    ];

    if (!subjectId || !academicYear || !section || !examType) {
        message.textContent =
            "Select the subject, academic year, section and examination.";
        return;
    }

    if (!Number.isFinite(maximumMarks) || maximumMarks <= 0) {
        message.textContent = "Enter a valid maximum mark.";
        return;
    }

    if (inputs.length === 0) {
        message.textContent = "Load the students before publishing marks.";
        return;
    }

    const records = [];

    for (const input of inputs) {
        const obtained = Number(input.value);

        if (
            input.value.trim() === "" ||
            !Number.isFinite(obtained) ||
            obtained < 0 ||
            obtained > maximumMarks
        ) {
            input.setCustomValidity(
                obtained > maximumMarks
                    ? "Marks cannot exceed maximum marks."
                    : "Enter valid marks."
            );
            input.reportValidity();
            input.focus();
            message.textContent = "Enter valid marks for every student.";
            return;
        }

        input.setCustomValidity("");

        records.push({
            student_id: Number(input.dataset.studentId),
            marks_obtained: obtained
        });
    }

    const payload = {
        subject_id: Number(subjectId),
        academic_year: Number(academicYear),
        section,
        exam_type: examType,
        maximum_marks: maximumMarks,
        records
    };

    try {
        submitButton.disabled = true;
        message.textContent = "Saving marks...";

        const saveResponse = await fetch("/api/faculty/marks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const saveResult = await saveResponse.json();

        if (!saveResponse.ok) {
            throw new Error(
                saveResult.error || "Unable to save marks."
            );
        }

        message.textContent = "Marks saved. Publishing marks...";

        const publishResponse = await fetch(
            "/api/faculty/marks/publish",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    subject_id: Number(subjectId),
                    academic_year: Number(academicYear),
                    section,
                    exam_type: examType
                })
            }
        );

        const publishResult = await publishResponse.json();

        if (!publishResponse.ok) {
            throw new Error(
                publishResult.error ||
                "Marks were saved, but publishing failed."
            );
        }

        inputs.forEach(input => {
            input.dataset.published = "true";
        });

        message.textContent =
            `Marks published successfully for ${records.length} students.`;

    } catch (error) {
        console.error("Marks save/publish error:", error);
        message.textContent = error.message;
    } finally {
        submitButton.disabled = false;
    }
});


function initFacultyAttendance() {
    const attendanceType = document.getElementById("attendanceType");
    const overallFilters = document.getElementById("overallAttendanceFilters");
    const subjectFilters = document.getElementById("subjectAttendanceFilters");
    const attendanceDate = document.getElementById("attendanceDate");
    const loadButton = document.getElementById("loadAttendanceStudents");

    if (!attendanceType || !overallFilters || !subjectFilters) {
        return;
    }

    // Set today's date by default
    if (attendanceDate) {
        attendanceDate.value = new Date().toISOString().split("T")[0];
    }

    // Show the relevant attendance options
    attendanceType.addEventListener("change", function () {
        overallFilters.style.display =
            this.value === "Overall" ? "block" : "none";

        subjectFilters.style.display =
            this.value === "Subject" ? "block" : "none";

        document.getElementById("facultyAttendanceContainer").innerHTML =
            "<p>Select an attendance type and date to continue.</p>";

        document.getElementById("facultyAttendanceMessage").textContent = "";

        if (this.value === "Overall") {
            loadAdvisorClass();
        } else if (this.value === "Subject") {
            loadAttendanceSubjects();
        }
    });

    if (loadButton) {
        loadButton.addEventListener("click", function () {
            if (attendanceType.value === "Overall") {
                loadOverallAttendanceStudents();
            } else if (attendanceType.value === "Subject") {
                loadSubjectAttendanceStudents();
            } else {
                alert("Please select an attendance type.");
            }
        });
    }
}
async function loadAdvisorClass() {
    const info = document.getElementById("advisorClassInfo");
    const message = document.getElementById("facultyAttendanceMessage");

    info.textContent = "Loading assigned class...";
    message.textContent = "";

    try {
        const response = await fetch("/api/faculty/attendance/classes");

        if (!response.ok) {
            throw new Error("Failed to load assigned class.");
        }

        const classes = await response.json();

        if (!classes.length) {
            info.textContent = "No class advisor assignment found.";
            return;
        }

        info.textContent = classes
            .map(item =>
                `Year ${item.academic_year}, Section ${item.section}`
            )
            .join(", ");

    } catch (error) {
        console.error("Error loading advisor class:", error);
        info.textContent = "Unable to load assigned class.";
    }
}
async function loadAttendanceSubjects() {
    const dropdown = document.getElementById("attendanceSubject");
    const message = document.getElementById("facultyAttendanceMessage");

    dropdown.innerHTML = '<option value="">Loading subjects...</option>';
    message.textContent = "";

    try {
        const response = await fetch("/api/faculty/subjects");

        if (!response.ok) {
            throw new Error("Failed to load subjects.");
        }

        const subjects = await response.json();

        dropdown.innerHTML =
            '<option value="">Select a subject</option>';

        if (subjects.length === 0) {
            dropdown.innerHTML =
                '<option value="">No assigned subjects found</option>';
            return;
        }

        subjects.forEach(subject => {
            const option = document.createElement("option");

            option.value = subject.subject_id;
            option.textContent =
                `${subject.subject_code} - ${subject.subject_name}`;

            dropdown.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading attendance subjects:", error);

        dropdown.innerHTML =
            '<option value="">Unable to load subjects</option>';
    }
}
async function loadOverallAttendanceStudents() {
    const date = document.getElementById("attendanceDate").value;
    const container = document.getElementById("facultyAttendanceContainer");
    const message = document.getElementById("facultyAttendanceMessage");

    if (!date) {
        message.textContent = "Please select an attendance date.";
        return;
    }

    container.innerHTML = "<p>Loading students...</p>";
    message.textContent = "";

    try {
        const response = await fetch(
            `/api/faculty/attendance/students?date=${encodeURIComponent(date)}`
        );

        if (!response.ok) {
            throw new Error("Failed to load students.");
        }

        const students = await response.json();

        if (!students.length) {
            container.innerHTML = "<p>No students found for your assigned class.</p>";
            return;
        }

        container.innerHTML = `
    <h3>Overall Class Attendance</h3>
    <p>Attendance Date: ${date}</p>

    <div style="margin: 15px 0;">
        <input
            type="text"
            id="overallAttendanceSearch"
            placeholder="Search by register number..."
            autocomplete="off"
            style="width: 100%; max-width: 350px; padding: 10px;"
        >
    </div>

    <table class="data-table">
                <thead>
                    <tr>
                        <th>Register Number</th>
                        <th>Student Name</th>
                        <th>Attendance Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map(student => `
                        <tr>
                            <td>${student.register_no}</td>
                            <td>${student.student_name}</td>
                            <td>
                                <select
                                    class="overall-attendance-status"
                                    data-student-id="${student.student_id}">
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Leave">Leave</option>
                                    <option value="OD">OD</option>
                                </select>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>

            <button
                type="button"
                class="btn btn-primary"
                id="saveOverallAttendance"
                style="margin-top:15px;">
                Save Overall Attendance
            </button>
        `;
        const searchInput = document.getElementById("overallAttendanceSearch");

searchInput.addEventListener("input", function () {
    const searchValue = this.value.trim().toLowerCase();

    const rows = container.querySelectorAll("tbody tr");

    rows.forEach(row => {
        const registerNo = row.cells[0].textContent.toLowerCase();

        row.style.display = registerNo.includes(searchValue)
            ? ""
            : "none";
    });
});
        document.getElementById("saveOverallAttendance")
    .addEventListener("click", async function () {
        const records = Array.from(
            container.querySelectorAll(".overall-attendance-status")
        ).map(select => ({
            student_id: Number(select.dataset.studentId),
            status: select.value
        }));

        if (records.length === 0) {
            message.textContent = "No attendance records to save.";
            return;
        }

        this.disabled = true;
        message.textContent = "Saving attendance...";

        try {
            const response = await fetch(
                "/api/faculty/attendance/overall",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        attendance_date: date,
                        records: records
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Failed to save attendance."
                );
            }

            message.textContent =
                `${result.message} (${result.saved_count} students)`;

        } catch (error) {
            console.error("Error saving overall attendance:", error);
            message.textContent = error.message;
        } finally {
            this.disabled = false;
        }
    });

    } catch (error) {
        console.error("Error loading overall attendance:", error);
        container.innerHTML = "<p>Unable to load students.</p>";
    }
}
async function loadSubjectAttendanceStudents() {
    const subjectId = document.getElementById("attendanceSubject").value;
    const date = document.getElementById("attendanceDate").value;
    const container = document.getElementById("facultyAttendanceContainer");
    const message = document.getElementById("facultyAttendanceMessage");

    if (!subjectId) {
        message.textContent = "Please select a subject.";
        return;
    }

    if (!date) {
        message.textContent = "Please select an attendance date.";
        return;
    }

    container.innerHTML = "<p>Loading students...</p>";
    message.textContent = "";

    try {
        const params = new URLSearchParams({
            subject_id: subjectId,
            date: date
        });

        const response = await fetch(
            `/api/faculty/attendance/students?${params.toString()}`
        );

        if (!response.ok) {
            throw new Error("Failed to load students.");
        }

        const students = await response.json();

        if (!students.length) {
            container.innerHTML = "<p>No students found for this subject.</p>";
            return;
        }

        container.innerHTML = `
            <h3>Subject-wise Attendance</h3>
            <p>Attendance Date: ${date}</p>

            <table class="data-table">
                <thead>
                    <tr>
                        <th>Register Number</th>
                        <th>Student Name</th>
                        <th>Attendance Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map(student => `
                        <tr>
                            <td>${student.register_no}</td>
                            <td>${student.student_name}</td>
                            <td>
                                <select
                                    class="subject-attendance-status"
                                    data-student-id="${student.student_id}">
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Leave">Leave</option>
                                    <option value="OD">OD</option>
                                </select>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>

            <button
                type="button"
                class="btn btn-primary"
                id="saveSubjectAttendance"
                style="margin-top:15px;">
                Save Subject Attendance
            </button>
        `;

    } catch (error) {
        console.error("Error loading subject attendance:", error);
        container.innerHTML = "<p>Unable to load students.</p>";
    }
}
document.addEventListener("submit", async function (event) {
    if (event.target.id !== "leaveApplicationForm") return;

    event.preventDefault();

    const form = event.target;
    const message = document.getElementById("leaveMessage");
    const submitButton = form.querySelector(
        'button[type="submit"]'
    );

    if (!message || !submitButton) return;

    const fromDate = form.elements.from_date.value;
    const toDate = form.elements.to_date.value;

    if (toDate < fromDate) {
        message.textContent = "End date cannot be before start date.";
        return;
    }

    const formData = new FormData(form);

    submitButton.disabled = true;
    message.textContent = "Submitting application...";

    try {
        const response = await fetch("/api/leave-applications", {
            method: "POST",
            credentials: "same-origin",
            body: formData
        });
        console.log("Leave history response:", response.status);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error || "Unable to submit application."
            );
        }

        message.textContent =
            `${result.message} Status: ${result.status}`;

        form.reset();

        if (typeof window.loadLeaveApplicationHistory === "function") {
            await window.loadLeaveApplicationHistory();
        } else {
            console.error("Leave history function is not available globally.");
        }

    } catch (error) {
        message.textContent = error.message;
    } finally {
        submitButton.disabled = false;
    }
});


async function initAllSubjectMarks() {
    const worksheet = document.getElementById("allMarksWorksheet");

    if (!worksheet) {
        console.error("All marks worksheet element not found.");
        return;
    }

    const year = document.getElementById("allMarksYear")?.value || "2";

    const activeExam = document.querySelector(
        "#allMarksExamTabs .btn-primary"
    );

    const examType = activeExam?.dataset.exam || "First Internal";

    const batch = "2025-2029";

    const semesterMap = {
        1: [1, 2],
        2: [3, 4],
        3: [5, 6],
        4: [7, 8]
    };

    const semesterSelect = document.getElementById("allMarksSemester");
    const availableSemesters = semesterMap[year];

    if (!availableSemesters) {
        worksheet.textContent = "Invalid academic year.";
        return;
    }

    const previousSemester = semesterSelect?.value;

    if (semesterSelect) {
        semesterSelect.innerHTML = availableSemesters
            .map(sem => `<option value="${sem}">Semester ${sem}</option>`)
            .join("");

        semesterSelect.value = availableSemesters.includes(
            Number(previousSemester)
        )
            ? previousSemester
            : String(availableSemesters[0]);
    }

    const semester = semesterSelect?.value || availableSemesters[0];

    worksheet.innerHTML = "<p>Loading class marks...</p>";

    try {
        const params = new URLSearchParams({
            batch,
            year,
            semester,
            exam_type: examType
        });

        const response = await fetch(
            `/api/faculty/class-marks?${params}`
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error || "Unable to load class marks."
            );
        }

        const { students, subjects, marks } = result;

        if (!students?.length || !subjects?.length) {
            worksheet.textContent = "No students or subjects found.";
            return;
        }

        // Store marks using student ID and subject ID.
        const marksMap = {};

        marks.forEach(mark => {
            marksMap[`${mark.student_id}-${mark.subject_id}`] =
                mark.marks_obtained;
        });

        // Prepare spreadsheet rows.
        const spreadsheetData = students.map(student => {
            const row = [
                student.register_no,
                student.student_name
            ];

            subjects.forEach(subject => {
                const value = marksMap[
                    `${student.student_id}-${subject.subject_id}`
                ];

                row.push(value ?? "");
            });

            return row;
        });

        // Prepare spreadsheet columns.
        const spreadsheetColumns = [
            {
                type: "text",
                title: "Register Number",
                width: 150,
                readOnly: true
            },
            {
                type: "text",
                title: "Student Name",
                width: 200,
                readOnly: true
            },
            ...subjects.map(subject => ({
                type: "numeric",
                title: `${subject.subject_code || ""} - ${subject.subject_name}`,
                width: 180
            }))
        ];

        // Clear the previous spreadsheet.
        worksheet.innerHTML = "";

        // Create the spreadsheet.
        jspreadsheet(worksheet, {
            worksheets: [
                {
                    data: spreadsheetData,
                    columns: spreadsheetColumns,
                    minDimensions: [
                        spreadsheetColumns.length,
                        students.length
                    ],
                    tableOverflow: true,
                    tableHeight: "450px",
                    columnSorting: false
                }
            ]
        });

    } catch (error) {
        console.error("Error loading class marks:", error);
        worksheet.textContent = error.message;
    }
}
// Handle examination tab clicks (works with dynamically loaded pages)
document.addEventListener("click", function (event) {
    const button = event.target.closest(
        "#allMarksExamTabs [data-exam]"
    );

    if (!button) return;

    document.querySelectorAll("#allMarksExamTabs [data-exam]")
        .forEach(tab => {
            tab.classList.remove("btn-primary");
            tab.classList.add("btn-secondary");
        });

    button.classList.remove("btn-secondary");
    button.classList.add("btn-primary");

    initAllSubjectMarks();
});

// Handle academic year and semester changes
document.addEventListener("change", function (event) {
    if (
        event.target.id === "allMarksYear" ||
        event.target.id === "allMarksSemester"
    ) {
        initAllSubjectMarks();
    }
});
/* =========================================================
   FACULTY NOTICES
   ========================================================= */

function initFacultyNotices() {

    const createButton =
        document.getElementById("createNoticeBtn");

    if (createButton) {
        createButton.addEventListener(
            "click",
            showNoticeForm
        );
    }

    loadNotices();
}


function showNoticeForm() {

    const formContainer =
        document.getElementById(
            "noticeFormContainer"
        );

    if (!formContainer) {
        return;
    }

    formContainer.innerHTML = `
    <div class="notice-form-panel">

        <div class="notice-form-header">
            <div>
                <span class="section-label">
                    NEW NOTICE
                </span>

                <h3>Create a Notice</h3>

                <p>
                    This notice will be shared with students
                    in your department.
                </p>
            </div>

            <button
                type="button"
                class="notice-close-btn"
                id="cancelNoticeBtn"
                aria-label="Close"
            >
                ×
            </button>
        </div>

        <form id="noticeForm" class="notice-form">

            <div class="notice-field">
                <label for="noticeTitle">
                    Notice Title
                </label>

                <input
                    type="text"
                    id="noticeTitle"
                    placeholder="Enter a clear notice title"
                    required
                >
            </div>

            <div class="notice-field">
                <label for="noticeDescription">
                    Description
                </label>

                <textarea
                    id="noticeDescription"
                    placeholder="Write the details of the notice..."
                    rows="5"
                    required
                ></textarea>
            </div>

            <div class="notice-form-row">

                <div class="notice-field">
                    <label for="noticeExpiry">
                        Expiry Date
                        <span>Optional</span>
                    </label>

                    <input
                        type="date"
                        id="noticeExpiry"
                    >
                </div>

                <div class="notice-field">
                    <label for="noticeAttachment">
                        Attachment
                        <span>Optional</span>
                    </label>

                    <input
                        type="file"
                        id="noticeAttachment"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    >
                </div>

            </div>

            <div class="notice-form-actions">

                <button
                    type="button"
                    class="notice-cancel-btn"
                    id="cancelNoticeBtnBottom"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    class="notice-publish-btn"
                >
                    Publish Notice
                </button>

            </div>

        </form>

    </div>
`;

    document
    .getElementById("cancelNoticeBtn")
    .addEventListener("click", () => {
        formContainer.innerHTML = "";
    });

document
    .getElementById("cancelNoticeBtnBottom")
    .addEventListener("click", () => {
        formContainer.innerHTML = "";
    });
}


async function createNotice(event) {

    event.preventDefault();

    const formData = new FormData();

    formData.append(
        "title",
        document.getElementById(
            "noticeTitle"
        ).value.trim()
    );

    formData.append(
        "description",
        document.getElementById(
            "noticeDescription"
        ).value.trim()
    );

    // Notices are automatically for
    // students in the staff member's department
    formData.append(
        "target_audience",
        "Students"
    );

    const expiryDate =
        document.getElementById(
            "noticeExpiry"
        ).value;

    if (expiryDate) {
        formData.append(
            "expiry_date",
            expiryDate
        );
    }

    const attachment =
        document.getElementById(
            "noticeAttachment"
        ).files[0];

    if (attachment) {
        formData.append(
            "attachment",
            attachment
        );
    }

    try {

        const response = await fetch(
            "/api/notices",
            {
                method: "POST",
                credentials: "same-origin",
                body: formData
            }
        );

        const result =
            await response.json();

        if (!response.ok) {
            throw new Error(
                result.error ||
                "Unable to create notice."
            );
        }

        alert("Notice published successfully.");

        document.getElementById(
            "noticeFormContainer"
        ).innerHTML = "";

        loadNotices();

    } catch (error) {

        console.error(
            "Notice creation error:",
            error
        );

        alert(error.message);
    }
}


async function loadNotices() {

    const container =
        document.getElementById(
            "noticesList"
        );

    if (!container) {
        return;
    }

    container.innerHTML =
        "<p>Loading notices...</p>";

    try {

        const response =
            await fetch(
                "/api/notices",
                {
                    credentials: "same-origin"
                }
            );

        const notices =
            await response.json();

        if (!response.ok) {
            throw new Error(
                notices.error ||
                "Unable to load notices."
            );
        }

        if (!notices.length) {

            container.innerHTML = `
                <div class="empty-state">
                    No notices created yet.
                </div>
            `;

            return;
        }

        container.innerHTML =
            notices.map(notice => `

                <div
                    class="card"
                    style="
                        padding:20px;
                        margin-bottom:15px;
                    "
                >

                    <h3>
                        ${escapeHTML(
                            notice.title
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            notice.description
                        )}
                    </p>

                    <div
                        style="
                            margin-top:15px;
                            font-size:13px;
                        "
                    >

                        <p>
                            <strong>Created:</strong>
                            ${escapeHTML(
                                notice.created_at ||
                                ""
                            )}
                        </p>

                        <p>
                            <strong>Expires:</strong>
                            ${escapeHTML(
                                notice.expiry_date ||
                                "No expiry date"
                            )}
                        </p>

                        ${
                            notice.attachment
                                ? `
                                    <p>
                                        <strong>
                                            Attachment:
                                        </strong>
                                        ${escapeHTML(
                                            notice.attachment
                                        )}
                                    </p>
                                `
                                : ""
                        }

                    </div>

                </div>

            `).join("");

    } catch (error) {

        console.error(
            "Notice loading error:",
            error
        );

        container.innerHTML = `
            <div class="empty-state">
                ${escapeHTML(
                    error.message
                )}
            </div>
        `;
    }
}
/* =========================================================
   FACULTY NOTES
   ========================================================= */

function initFacultyNotes() {

    const uploadButton =
        document.getElementById("uploadNoteBtn");

    if (uploadButton) {
        uploadButton.addEventListener(
            "click",
            showNoteUploadForm
        );
    }

    loadFacultyNotes();
}


async function showNoteUploadForm() {

    const formContainer =
        document.getElementById(
            "noteFormContainer"
        );

    if (!formContainer) {
        return;
    }

    formContainer.innerHTML = `
        <div class="notice-form-panel">

            <div class="notice-form-header">

                <div>
                    <span class="section-label">
                        STUDY MATERIAL
                    </span>

                    <h3>Upload Note</h3>

                    <p>
                        Select a subject and upload
                        the study material.
                    </p>
                </div>

                <button
                    type="button"
                    class="notice-close-btn"
                    id="closeNoteFormBtn"
                >
                    ×
                </button>

            </div>

            <form
                id="noteUploadForm"
                class="notice-form"
            >

                <div class="notice-field">

                    <label for="noteSubject">
                        Subject
                    </label>

                    <select
                        id="noteSubject"
                        required
                    >
                        <option value="">
                            Loading subjects...
                        </option>
                    </select>

                </div>

                <div class="notice-field">

                    <label for="noteTitle">
                        Note Title
                    </label>

                    <input
                        type="text"
                        id="noteTitle"
                        placeholder="Enter a title for this material"
                        required
                    >

                </div>

                <div class="notice-field">

                    <label for="noteDescription">
                        Description
                        <span>Optional</span>
                    </label>

                    <textarea
                        id="noteDescription"
                        rows="4"
                        placeholder="Briefly describe this study material..."
                    ></textarea>

                </div>

                <div class="notice-field">

                    <label for="noteFile">
                        Upload File
                    </label>

                    <input
                        type="file"
                        id="noteFile"
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                        required
                    >

                </div>

                <div class="notice-form-actions">

                    <button
                        type="button"
                        class="notice-cancel-btn"
                        id="cancelNoteBtn"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        class="notice-publish-btn"
                    >
                        Upload Note
                    </button>

                </div>

            </form>

        </div>
    `;

    document
        .getElementById("closeNoteFormBtn")
        .addEventListener("click", closeNoteForm);

    document
        .getElementById("cancelNoteBtn")
        .addEventListener("click", closeNoteForm);

    document
        .getElementById("noteUploadForm")
        .addEventListener(
            "submit",
            uploadFacultyNote
        );

    await loadFacultyNoteSubjects();
}


function closeNoteForm() {

    const formContainer =
        document.getElementById(
            "noteFormContainer"
        );

    if (formContainer) {
        formContainer.innerHTML = "";
    }
}


async function loadFacultyNoteSubjects() {

    const select =
        document.getElementById("noteSubject");

    if (!select) {
        return;
    }

    try {

        const response =
            await fetch(
                "/api/faculty/subjects"
            );

        const subjects =
            await response.json();

        if (!response.ok) {
            throw new Error(
                subjects.error ||
                "Unable to load subjects."
            );
        }

        select.innerHTML = `
            <option value="">
                Select a subject
            </option>
        `;

        subjects.forEach(subject => {

            const option =
                document.createElement("option");

            option.value =
                subject.subject_id;

            option.textContent =
                `${subject.subject_name} (${subject.subject_code})`;

            select.appendChild(option);
        });

    } catch (error) {

        console.error(
            "Subject loading error:",
            error
        );

        select.innerHTML = `
            <option value="">
                Unable to load subjects
            </option>
        `;
    }
}


async function uploadFacultyNote(event) {

    event.preventDefault();

    const submitButton =
        event.target.querySelector(
            'button[type="submit"]'
        );

    const formData = new FormData();

    formData.append(
        "subject_id",
        document.getElementById(
            "noteSubject"
        ).value
    );

    formData.append(
        "title",
        document.getElementById(
            "noteTitle"
        ).value.trim()
    );

    formData.append(
        "description",
        document.getElementById(
            "noteDescription"
        ).value.trim()
    );

    formData.append(
        "file",
        document.getElementById(
            "noteFile"
        ).files[0]
    );

    try {

        submitButton.disabled = true;
        submitButton.textContent =
            "Uploading...";

        const response =
            await fetch(
                "/api/faculty/notes",
                {
                    method: "POST",
                    body: formData
                }
            );

        const result =
            await response.json();

        if (!response.ok) {
            throw new Error(
                result.error ||
                "Unable to upload note."
            );
        }

        closeNoteForm();

        await loadFacultyNotes();

        alert(
            "Note uploaded successfully."
        );

    } catch (error) {

        console.error(
            "Note upload error:",
            error
        );

        alert(error.message);

    } finally {

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent =
                "Upload Note";
        }
    }
}


async function loadFacultyNotes() {

    const container =
        document.getElementById(
            "facultyNotesList"
        );

    if (!container) {
        return;
    }

    try {

        /*
         * We will add a faculty-specific
         * GET endpoint next.
         */
        const response = await fetch(
    "/api/faculty/notes"
);

        const notes =
            await response.json();

        if (!response.ok) {
            throw new Error(
                notes.error ||
                "Unable to load notes."
            );
        }

        if (notes.length === 0) {

            container.innerHTML = `
                <div class="empty-state">
                    No notes uploaded yet.
                </div>
            `;

            return;
        }

        container.innerHTML =
            notes.map(note => `

                <div
                    class="card item-card"
                    style="margin-bottom:14px;"
                >

                    <h4>
                        ${escapeHTML(
                            note.title
                        )}
                    </h4>

                    <div class="meta">
                        ${escapeHTML(
                            note.subject_name
                        )}
                        (${escapeHTML(
                            note.subject_code
                        )})
                    </div>

                    ${
                        note.description
                            ? `
                                <p style="
                                    color:var(--muted);
                                    font-size:13px;
                                    margin-top:10px;
                                ">
                                    ${escapeHTML(
                                        note.description
                                    )}
                                </p>
                            `
                            : ""
                    }

                    <div style="
                        margin-top:12px;
                        font-size:12px;
                        color:var(--muted);
                    ">
                        Uploaded:
                        ${escapeHTML(
                            note.uploaded_at
                        )}
                    </div>

                </div>

            `).join("");

    } catch (error) {

        console.error(
            "Notes loading error:",
            error
        );

        container.innerHTML = `
            <div class="empty-state">
                ${escapeHTML(
                    error.message
                )}
            </div>
        `;
    }
}
/* =========================================================
   FACULTY STUDENT VOICE
   ========================================================= */

function initFacultyStudentVoice() {
    loadFacultyStudentVoice();
}


async function loadFacultyStudentVoice() {

    const container = document.getElementById(
        "facultyStudentVoiceList"
    );

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="notice-loading">
            Loading student submissions...
        </div>
    `;

    try {

        const response = await fetch(
            "/api/faculty/student-voice"
        );

        const voices = await response.json();

        if (!response.ok) {
            throw new Error(
                voices.error ||
                "Unable to load student submissions."
            );
        }

        if (!voices.length) {

            container.innerHTML = `
                <div class="empty-state">
                    No student submissions to review.
                </div>
            `;

            return;
        }

        container.innerHTML = voices.map(voice => {

            const typeClass =
                voice.voice_type === "Complaint"
                    ? "voice-complaint"
                    : "voice-feedback";

            const statusClass =
                voice.status
                    .toLowerCase()
                    .replace(/\s+/g, "-");

            return `
    <div class="voice-card">

        <div class="voice-card-top">

            <div class="voice-main-info">

                <div class="voice-badges">

                    <span class="voice-type ${typeClass}">
                        ${escapeHTML(voice.voice_type)}
                    </span>

                    <span class="voice-status status-${statusClass}">
                        ${escapeHTML(voice.status)}
                    </span>

                </div>

                <h4 class="voice-title">
                    ${escapeHTML(voice.title)}
                </h4>

            </div>

            <div class="voice-date">
                ${escapeHTML(voice.created_at)}
            </div>

        </div>


        <div class="voice-meta">

            <span class="voice-category">
                ${escapeHTML(voice.category)}
            </span>

            <span class="voice-dot">•</span>

            <span>
                ${escapeHTML(voice.target_audience)}
            </span>

        </div>


        <div class="voice-message">
            ${escapeHTML(voice.description)}
        </div>


        <div class="voice-card-footer">

            <div class="voice-student">

                <span class="voice-student-label">
                    Submitted by
                </span>

                <strong>
                    ${escapeHTML(voice.student_name)}
                </strong>

                ${
                    voice.register_no
                        ? `
                            <span class="voice-register">
                                ${escapeHTML(voice.register_no)}
                            </span>
                        `
                        : ""
                }

            </div>


            <div class="voice-status-control">

                <label for="voice-status-${voice.voice_id}">
                    Status
                </label>

                <select
                    id="voice-status-${voice.voice_id}"
                    class="voice-status-select"
                    data-voice-id="${voice.voice_id}"
                >
                    <option
                        value="Pending"
                        ${voice.status === "Pending" ? "selected" : ""}
                    >
                        Pending
                    </option>

                    <option
                        value="In Progress"
                        ${voice.status === "In Progress" ? "selected" : ""}
                    >
                        In Progress
                    </option>

                    <option
                        value="Resolved"
                        ${voice.status === "Resolved" ? "selected" : ""}
                    >
                        Resolved
                    </option>

                </select>

            </div>

        </div>

    </div>
`;
        }).join("");
        container.querySelectorAll(
    ".voice-status-select"
).forEach(select => {

    select.addEventListener(
        "change",
        updateFacultyVoiceStatus
    );

});

    } catch (error) {

        console.error(
            "Student Voice loading error:",
            error
        );

        container.innerHTML = `
            <div class="empty-state">
                ${escapeHTML(error.message)}
            </div>
        `;
    }
}
async function updateFacultyVoiceStatus(event) {

    const select = event.target;

    const voiceId =
        select.dataset.voiceId;

    const status =
        select.value;

    select.disabled = true;

    try {

        const response = await fetch(
            `/api/faculty/student-voice/${voiceId}/status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );

        const result =
            await response.json();

        if (!response.ok) {
            throw new Error(
                result.error ||
                "Unable to update status."
            );
        }

        await loadFacultyStudentVoice();

    } catch (error) {

        console.error(
            "Status update error:",
            error
        );

        alert(error.message);

        // Reload to restore the original status
        await loadFacultyStudentVoice();

    }
}