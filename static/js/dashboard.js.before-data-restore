/* =========================================================
   EDUSPHERE DASHBOARD
   ========================================================= */


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

        const li =
            document.createElement("li");

        const link =
            document.createElement("a");

        link.className =
            "nav-link";

        link.href =
            "#";

        link.textContent =
            item.label;

        link.dataset.view =
            item.id;

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                loadView(
                    item.id,
                    item.label,
                    link
                );

            }
        );

        li.appendChild(link);

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


    if (
        viewId === "std-assignments" &&
        typeof loadStudentAssignments === "function"
    ) {
        loadStudentAssignments();
    }


    if (
        viewId === "std-attendance" &&
        typeof loadStudentAttendance === "function"
    ) {
        loadStudentAttendance();
    }

}


/* =========================================================
   TEMPLATE RENDERING
   ========================================================= */

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

                <h3>
                    Notes
                </h3>

            </div>


            <div class="empty-state">

                Notes will appear here.

            </div>

        `;
    }


    /* =====================================================
       ASSIGNMENTS
       ===================================================== */

    if (viewId === "std-assignments") {

        return `

            <div class="section-title">

                <h3>
                    Assignments
                </h3>

            </div>


            <div class="grid">

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
       ATTENDANCE
       ===================================================== */

    if (viewId === "std-attendance") {

        return `

            <div class="section-title">

                <h3>
                    Attendance
                </h3>

            </div>


            <div class="grid">

                <div class="card">

                    <h3>
                        Overall Attendance
                    </h3>

                    <div class="value">
                        88%
                    </div>

                </div>

            </div>

        `;
    }


    /* =====================================================
       MARKS
       ===================================================== */

    if (viewId === "std-marks") {

        return `

            <div class="section-title">

                <h3>
                    Marks
                </h3>

            </div>


            <div class="empty-state">

                Marks will appear here.

            </div>

        `;
    }


    /* =====================================================
       STUDENT VOICE
       ===================================================== */

    if (viewId === "std-voice") {

        return `

            <div class="section-title">

                <h3>
                    Student Voice
                </h3>

            </div>


            <div class="empty-state">

                Student Voice section.

            </div>

        `;
    }


    /* =====================================================
       LEAVE APPLICATION
       ===================================================== */

    if (viewId === "std-leave") {

        return `

            <div class="section-title">

                <h3>
                    Leave Application
                </h3>

            </div>


            <div class="empty-state">

                Leave applications will appear here.

            </div>

        `;
    }


    /* =====================================================
       FACULTY DASHBOARD
       ===================================================== */

    if (viewId === "faculty-dashboard") {

        return `

            <div class="section-title">

                <h3>
                    Faculty Dashboard
                </h3>

            </div>


            <div class="empty-state">

                Faculty dashboard content.

            </div>

        `;
    }


    /* =====================================================
       ADMIN DASHBOARD
       ===================================================== */

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


/* =========================================================
   INITIALIZE
   ========================================================= */

renderNavigation();


loadView(
    currentRoleConfig.defaultView,
    "Dashboard",
    null
);