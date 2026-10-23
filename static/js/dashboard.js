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
            id: "faculty-documents",
            label: "Student Documents"
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
        <p id="marksEntryMessage" role="status" aria-live="polite"></p>
        <button type="submit" class="marks-submit-btn">
            Save Marks
        </button>
    </div>

</form>

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

        if (data.overall.total === 0) {

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

    if (!container) return;

    container.textContent = "Loading assignments...";

    try {
        const response = await fetch("/api/assignments");
        const assignments = await response.json();
        console.log("Assignments received:", assignments);

        if (!response.ok) {
            throw new Error(
                assignments.error || "Unable to load assignments."
            );
        }

        if (assignments.length === 0) {
            container.textContent = "No assignments found.";
            return;
        }

        container.innerHTML = assignments.map(assignment => `
            <div class="card" style="padding:16px;margin-bottom:12px;">
                <h4>${assignment.title}</h4>
                <p>
                    Subject: ${assignment.subject_name || "N/A"}
                </p>
                <p>
                    Due date: ${assignment.due_date || "N/A"}
                </p>
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
        `).join("");

    } catch (error) {
        console.error("Faculty assignments error:", error);
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
            year: year,
            section: section,
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
            container.textContent =
                "No submissions found for the selected filters.";
            return;
        }

        container.innerHTML = submissions.map(item => `
            <div class="card" style="padding:16px;margin-bottom:12px;">
                <h4>${item.assignment_title}</h4>
                <p>Subject: ${item.subject_name}</p>
                <p>Student: ${item.student_name}</p>
                <p>Register No: ${item.register_no}</p>
                <p>File: ${item.original_filename}</p>
                <p>Submitted: ${item.submitted_at}</p>
                <p>Status: ${item.status}</p>

                <a href="/api/assignment-submissions/${item.submission_id}/download"
                   class="btn btn-outline"
                   style="display:inline-block;margin-top:10px;">
                    Download Student File
                </a>
            </div>
        `).join("");

    } catch (error) {
        console.error("Faculty submissions error:", error);
        container.textContent = error.message;
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
subjectSelect.addEventListener(
    "change",
    loadFacultyFilterAssignments
);
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

    if (!subjectSelect || !tbody) return;

    const subjectId = subjectSelect.value;
    console.log("Selected subject ID:", subjectId);
    const academicYear = document.getElementById("marksAcademicYear")?.value;
const section = document.getElementById("marksSection")?.value;
    tbody.replaceChildren();

     if (!subjectId || !academicYear || !section) {
    const row = tbody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 5;
    cell.textContent =
        "Select a subject, academic year and section to load students.";

    if (count) count.textContent = "0 students";
    return;
}

    const loadingRow = tbody.insertRow();
    const loadingCell = loadingRow.insertCell();
    loadingCell.colSpan = 5;
    loadingCell.textContent = "Loading students...";

    try {
        const params = new URLSearchParams({
    subject_id: subjectId,
    academic_year: academicYear,
    section: section
});

const response = await fetch(`/api/faculty/marks/students?${params}`);

        const students = await response.json();

        if (!response.ok) {
            throw new Error(students.error || "Unable to load students.");
        }

        tbody.replaceChildren();

        if (count) {
            count.textContent =
                `${students.length} student${students.length === 1 ? "" : "s"}`;
        }

        if (students.length === 0) {
            const row = tbody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 5;
            cell.textContent = "No students found for this subject.";
            return;
        }

        students.forEach((student, index) => {
            const row = tbody.insertRow();

            row.insertCell().textContent = index + 1;
            row.insertCell().textContent = student.register_no;
            row.insertCell().textContent = student.student_name;

            const marksCell = row.insertCell();
            const input = document.createElement("input");

            input.type = "number";
            input.min = "0";
            input.step = "0.01";
            input.required = true;
            input.placeholder = "Enter marks";
            input.className = "marks-student-input";
            input.dataset.studentId = student.student_id;

            marksCell.appendChild(input);

            const percentageCell = row.insertCell();
            percentageCell.textContent = "—";

            input.addEventListener("input", () => {
                const maximum = Number(
                    document.getElementById("marksMaximum")?.value
                );
                const obtained = Number(input.value);

                if (
                    input.value === "" ||
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
            });
        });
    } catch (error) {
        console.error("Student loading error:", error);

        tbody.replaceChildren();
        const row = tbody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 5;
        cell.textContent = "Unable to load students. Please try again.";

        if (count) count.textContent = "0 students";
    }
}

document.addEventListener("change", function (event) {
    if (
        event.target.id === "marksSubject" ||
        event.target.id === "marksAcademicYear" ||
        event.target.id === "marksSection"
    ) {
        loadFacultyMarksStudents();
    }
});document.addEventListener("change", function (event) {
    if (
        event.target.id === "marksSubject" ||
        event.target.id === "marksAcademicYear" ||
        event.target.id === "marksSection"
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

        <a href="/api/assignment-submissions/${item.submission_id}/download"
           class="btn btn-outline"
           style="display:inline-block;margin-top:10px;">
            Download Submission
        </a>
    </div>
`).join("");

    } catch (error) {
        console.error("Submission history error:", error);

        container.textContent =
            "Unable to load submission history. Please try again.";
    }
}
