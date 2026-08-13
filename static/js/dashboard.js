
const roleConfig = {
  student: {
    label: "Student", avatar: "S",
    menu: [
    
  { id: "std-dashboard", label: "Dashboard" },
  { id: "std-notes", label: "Notes" },
  { id: "std-assignments", label: "Assignments" },
  { id: "std-attendance", label: "Attendance" },
  { id: "std-marks", label: "Marks" },
  { id: "std-announcements", label: "Announcements" },
  { id: "std-voice", label: "Student Voice" },
  { id: "std-leave", label: "Leave Application" },
] 
  },
  representative: {
    label: "Class Representative", avatar: "R",
    menu: [
      { id: "rep-submit", label: "Submit Material" },
      { id: "rep-status", label: "My Submissions" },
    ]
  },
  faculty: {
  label: "Faculty", avatar: "F",
  menu: [
    { id: "fac-dashboard", label: "Dashboard" },
    { id: "fac-queue", label: "Approval Queue" },
    { id: "fac-upload", label: "Upload Notes" },
    { id: "fac-assignments", label: "Assignments" },
    { id: "fac-attendance", label: "Attendance" },
    { id: "fac-marks", label: "Marks" },
    { id: "fac-announce", label: "Post Announcement" }
  ]
},
  admin: {
    label: "Admin", avatar: "A",
    menu: [
      { id: "adm-dashboard", label: "Overview" },
      { id: "adm-departments", label: "Departments" },
      { id: "adm-announce", label: "Institution Announcement" },
    ]
  }
};

const currentRole = window.USER_ROLE || 'student';
let currentDept = window.USER_DEPARTMENT || "Department";



let currentViewId = null, currentViewTitle = null;
function loadView(viewId, title, el) {

  currentViewId = viewId;
  currentViewTitle = title;

  document.getElementById('page-title').innerText = title;

  if (el) {
    document.querySelectorAll('.nav-link')
      .forEach(n => n.classList.remove('active'));

    el.classList.add('active');
  }

  renderCurrentView();

  if (viewId === "std-notes") {
    loadStudentNotes();
}

if (viewId === "std-assignments") {
    loadStudentAssignments();
}

if (viewId === "std-attendance") {
    loadStudentAttendance();
}
}

function renderCurrentView() {
  document.getElementById('viewContainer').innerHTML = renderTemplate(currentViewId, currentDept);
}

function seal(status) {
  const map = { approved: 'Approved', pending: 'Pending', rejected: 'Rejected' };
  return `<span class="seal seal-${status}">${map[status]}</span>`;
}

function renderTemplate(viewId, dept) {
  switch (viewId) {

    case 'fac-dashboard':
  return `
    <div class="grid">
      <div class="card">
        <h3>My Subjects</h3>
        <div class="value">4</div>
      </div>

      <div class="card">
        <h3>Pending Approvals</h3>
        <div class="value">3</div>
      </div>

      <div class="card">
        <h3>Assignments</h3>
        <div class="value">8</div>
      </div>

      <div class="card">
        <h3>Students</h3>
        <div class="value">120</div>
      </div>
    </div>

    <div class="section-title">
      <h3 style="font-family:var(--font-display); font-size:16px;">
        Today's Overview — ${dept}
      </h3>
    </div>

    <div class="grid">
      <div class="card item-card">
        <h4>Database Systems</h4>
        <div class="meta">Semester 5 · AI & DS</div>
      </div>

      <div class="card item-card">
        <h4>Web Development</h4>
        <div class="meta">Semester 5 · AI & DS</div>
      </div>
    </div>
  `;

  case 'fac-assignments':
  return `
    <div class="form-row">
      <div class="field">
        <label>Title</label>
        <input type="text" placeholder="Assignment title">
      </div>

      <div class="field">
        <label>Subject</label>
        <input type="text" placeholder="Subject">
      </div>

      <div class="field">
        <label>Due Date</label>
        <input type="date">
      </div>

      <div class="field">
        <label>File</label>
        <input type="file">
      </div>

      <button class="btn" onclick="alert('Assignment created')">
        Create
      </button>
    </div>

    <div class="section-title">
      <h3 style="font-family:var(--font-display); font-size:16px;">
        My Assignments
      </h3>
    </div>

    <table>
      <tr>
        <th>Title</th>
        <th>Subject</th>
        <th>Due Date</th>
        <th>Status</th>
      </tr>

      <tr>
        <td>SQL Queries Practice</td>
        <td>Database Systems</td>
        <td>25 Oct</td>
        <td>Active</td>
      </tr>

      <tr>
        <td>Web Prototype</td>
        <td>Web Development</td>
        <td>28 Oct</td>
        <td>Active</td>
      </tr>
    </table>
  `;

  case 'fac-attendance':
  return `
    <div class="form-row">
      <div class="field">
        <label>Subject</label>
        <select>
          <option>Database Systems</option>
          <option>Web Development</option>
          <option>Artificial Intelligence</option>
        </select>
      </div>

      <div class="field">
        <label>Date</label>
        <input type="date">
      </div>

      <button class="btn" onclick="alert('Attendance opened')">
        Mark Attendance
      </button>
    </div>

    <div class="section-title">
      <h3 style="font-family:var(--font-display); font-size:16px;">
        Recent Attendance
      </h3>
    </div>

    <table>
      <tr>
        <th>Student</th>
        <th>Register No.</th>
        <th>Status</th>
      </tr>

      <tr>
        <td>Student One</td>
        <td>23AIDS001</td>
        <td>Present</td>
      </tr>

      <tr>
        <td>Student Two</td>
        <td>23AIDS002</td>
        <td>Absent</td>
      </tr>
    </table>
  `;

  case 'fac-marks':
  return `
    <div class="form-row">
      <div class="field">
        <label>Subject</label>
        <select>
          <option>Database Systems</option>
          <option>Web Development</option>
          <option>Artificial Intelligence</option>
        </select>
      </div>

      <div class="field">
        <label>Exam Type</label>
        <select>
          <option>Internal I</option>
          <option>Internal II</option>
          <option>Model Exam</option>
        </select>
      </div>

      <button class="btn" onclick="alert('Marks entry opened')">
        Enter Marks
      </button>
    </div>

    <table>
      <tr>
        <th>Student</th>
        <th>Register No.</th>
        <th>Marks</th>
        <th>Maximum</th>
      </tr>

      <tr>
        <td>Student One</td>
        <td>23AIDS001</td>
        <td>42</td>
        <td>50</td>
      </tr>

      <tr>
        <td>Student Two</td>
        <td>23AIDS002</td>
        <td>38</td>
        <td>50</td>
      </tr>
    </table>
  `;


    case 'std-leave':
  return `
    <div class="section-title">
      <h3 style="font-family:var(--font-display); font-size:16px;">
        Apply for Leave
      </h3>
    </div>

    <div class="form-row">
      <div class="field">
        <label>From Date</label>
        <input type="date">
      </div>

      <div class="field">
        <label>To Date</label>
        <input type="date">
      </div>

      <div class="field" style="flex:2 1 300px;">
        <label>Reason</label>
        <input type="text" placeholder="Reason for leave">
      </div>

      <div class="field">
        <label>Supporting Document</label>
        <input type="file">
      </div>

      <button class="btn" onclick="alert('Leave application submitted')">
        Apply
      </button>
    </div>

    <div class="section-title">
      <h3 style="font-family:var(--font-display); font-size:16px;">
        My Leave History
      </h3>
    </div>

    <table>
      <tr>
        <th>From</th>
        <th>To</th>
        <th>Reason</th>
        <th>Status</th>
      </tr>

      <tr>
        <td>15 Oct</td>
        <td>16 Oct</td>
        <td>Personal</td>
        <td>Approved</td>
      </tr>

      <tr>
        <td>28 Oct</td>
        <td>29 Oct</td>
        <td>Medical</td>
        <td>Pending</td>
      </tr>
    </table>
  `;

case 'std-voice':
  return `
    <div class="section-title">
      <h3 style="font-family:var(--font-display); font-size:16px;">
        Share Your Voice
      </h3>
    </div>

    <div class="form-row">
      <div class="field">
        <label>Category</label>
        <select>
          <option>Academic</option>
          <option>Infrastructure</option>
          <option>Hostel</option>
          <option>Transport</option>
          <option>Other</option>
        </select>
      </div>

      <div class="field">
        <label>Title</label>
        <input type="text" placeholder="What would you like to share?">
      </div>

      <div class="field" style="flex:2 1 300px;">
        <label>Your Message</label>
        <input type="text" placeholder="Tell us about your concern or suggestion">
      </div>

      <button class="btn" onclick="alert('Your voice has been submitted')">
        Submit
      </button>
    </div>

    <p style="color:var(--muted); font-size:12px; margin-top:4px;">
      Share a concern, suggestion, or issue with the college. Your feedback helps us improve the student experience.
    </p>

    <div class="section-title">
      <h3 style="font-family:var(--font-display); font-size:16px;">
        My Submissions
      </h3>
    </div>

    <table>
      <tr>
        <th>Title</th>
        <th>Category</th>
        <th>Status</th>
      </tr>

      <tr>
        <td>Projector not working</td>
        <td>Infrastructure</td>
        <td>In Progress</td>
      </tr>

      <tr>
        <td>Lab system issue</td>
        <td>Academic</td>
        <td>Resolved</td>
      </tr>
    </table>
  `;

  case 'std-marks':
  return `
    <div class="grid">
      <div class="card">
        <h3>Overall Average</h3>
        <div class="value">82%</div>
      </div>

      <div class="card">
        <h3>Subjects</h3>
        <div class="value">6</div>
      </div>

      <div class="card">
        <h3>Current Semester</h3>
        <div class="value">5</div>
      </div>
    </div>

    <div class="section-title">
      <h3 style="font-family:var(--font-display); font-size:16px;">
        Examination Results
      </h3>
    </div>

    <table>
      <tr>
        <th>Subject</th>
        <th>Exam</th>
        <th>Marks</th>
        <th>Maximum</th>
        <th>Percentage</th>
      </tr>

      <tr>
        <td>Database Systems</td>
        <td>Internal I</td>
        <td>42</td>
        <td>50</td>
        <td>84%</td>
      </tr>

      <tr>
        <td>Web Development</td>
        <td>Internal I</td>
        <td>44</td>
        <td>50</td>
        <td>88%</td>
      </tr>

      <tr>
        <td>Artificial Intelligence</td>
        <td>Internal I</td>
        <td>39</td>
        <td>50</td>
        <td>78%</td>
      </tr>

      <tr>
        <td>Data Structures</td>
        <td>Internal I</td>
        <td>41</td>
        <td>50</td>
        <td>82%</td>
      </tr>
    </table>
  `;



    case 'std-attendance':
    return `
        <div id="attendanceContainer">

            <p style="color:var(--muted); font-size:13px;">
                Loading attendance...
            </p>

        </div>

        <p style="
            color:var(--muted);
            font-size:12px;
            margin-top:12px;
        ">
            Attendance shown is based on your personal attendance records.
        </p>
    `;

    case 'std-dashboard':
      return `
        <div class="grid">
          <div class="card"><h3>Attendance</h3><div class="value">88%</div></div>
          <div class="card"><h3>CGPA</h3><div class="value">8.4</div></div>
          <div class="card"><h3>Pending Assignments</h3><div class="value">2</div></div>
        </div>
        <div class="section-title"><h3 style="font-family:var(--font-display); font-size:16px;">Recent Announcements — ${dept}</h3></div>
        <div class="grid">
          <div class="card item-card"><h4>Mid-Semester Schedule Released</h4><div class="meta">${dept} · 2 days ago</div></div>
          <div class="card item-card"><h4>Guest Lecture — Friday 3 PM</h4><div class="meta">${dept} · 4 days ago</div></div>
        </div>`;

    case 'std-notes':
  return `
    <div id="notesContainer">
      <p style="color:var(--muted); font-size:13px;">
        Loading notes...
      </p>
    </div>

    <p style="color:var(--muted); font-size:12px; margin-top:12px;">
      Only faculty-approved notes from your department appear here.
    </p>
  `;

    case 'std-assignments':
  return `
    <div id="assignmentsContainer">

      <p style="color:var(--muted); font-size:13px;">
        Loading assignments...
      </p>

    </div>

    <p style="color:var(--muted); font-size:12px; margin-top:12px;">
      Assignments from your department are displayed here.
    </p>
  `;

    case 'std-announcements':
      return `
        <div class="grid">
          <div class="card item-card"><h4>Fee Payment Deadline Extended</h4><div class="meta">Institution-wide</div></div>
          <div class="card item-card"><h4>${dept} Lab Reallocation</h4><div class="meta">${dept} only</div></div>
        </div>`;

    case 'rep-submit':
      return `
        <div class="form-row">
          <div class="field"><label>Title</label><input type="text" placeholder="e.g. Unit 4 Notes"></div>
          <div class="field"><label>Subject</label><input type="text" placeholder="e.g. Operating Systems"></div>
          <div class="field"><label>File</label><input type="file"></div>
          <button class="btn" onclick="alert('Submitted for faculty approval')">Submit</button>
        </div>
        <p style="color:var(--muted); font-size:12px;">Submitted on behalf of ${dept} faculty — nothing publishes until it's reviewed.</p>`;

    case 'rep-status':
      return `
        <div class="grid">
          <div class="card item-card">${seal('approved')}<h4>Unit 2 Notes</h4><div class="meta">Reviewed by faculty · 3 days ago</div></div>
          <div class="card item-card">${seal('pending')}<h4>Unit 3 Notes</h4><div class="meta">Awaiting review</div></div>
          <div class="card item-card">${seal('rejected')}<h4>Old Syllabus PDF</h4><div class="meta">"Please upload the revised version"</div></div>
        </div>`;

    case 'fac-queue':
      return `
        <div class="grid">
          <div class="card item-card">${seal('pending')}<h4>Unit 3 Notes</h4><div class="meta">Submitted by Class Rep · ${dept}</div>
            <div style="margin-top:10px; display:flex; gap:8px;">
              <button class="btn" onclick="alert('Approved')">Approve</button>
              <button class="btn btn-outline" onclick="alert('Rejected')">Reject</button>
            </div>
          </div>
        </div>`;

    case 'fac-upload':
      return `
        <div class="form-row">
          <div class="field"><label>Title</label><input type="text"></div>
          <div class="field"><label>Subject</label><input type="text"></div>
          <div class="field"><label>Semester</label><input type="number" min="1" max="8"></div>
          <div class="field"><label>File</label><input type="file"></div>
          <button class="btn" onclick="alert('Published to ' + '${dept}' + ' students')">Publish</button>
        </div>`;

    case 'fac-announce':
      return `
        <div class="form-row">
          <div class="field" style="flex:1 1 200px;"><label>Title</label><input type="text"></div>
          <div class="field" style="flex:2 1 260px;"><label>Body</label><input type="text"></div>
          <button class="btn" onclick="alert('Posted to ' + '${dept}')">Post</button>
        </div>`;

    case 'adm-dashboard':
      return `
        <div class="grid">
          <div class="card"><h3>Departments</h3><div class="value">8</div></div>
          <div class="card"><h3>Faculty</h3><div class="value">42</div></div>
          <div class="card"><h3>Students</h3><div class="value">1,180</div></div>
          <div class="card"><h3>Representatives</h3><div class="value">24</div></div>
        </div>`;

    case 'adm-departments':
      return `
        <table>
          <tr><th>Name</th><th>Code</th></tr>
          <tr><td>AI & DS</td><td class="mono">AIDS</td></tr>
          <tr><td>CSE</td><td class="mono">CSE</td></tr>
          <tr><td>IT</td><td class="mono">IT</td></tr>
        </table>
        <div class="form-row" style="margin-top:16px;">
          <div class="field"><label>Name</label><input type="text"></div>
          <div class="field"><label>Code</label><input type="text"></div>
          <button class="btn" onclick="alert('Department created')">Create</button>
        </div>`;

    case 'adm-announce':
      return `
        <div class="form-row">
          <div class="field" style="flex:1 1 200px;"><label>Title</label><input type="text"></div>
          <div class="field" style="flex:2 1 260px;"><label>Body</label><input type="text"></div>
          <button class="btn" onclick="alert('Publish to Everyone')">Publish to Everyone</button>
        </div>`;

    default:
      return `<div class="empty-state">Nothing here yet.</div>`;
  }
}
// Get the current user's role
const role = roleConfig[currentRole] || roleConfig.student;

// Update user information
document.getElementById("userRole").innerText = role.label;
document.getElementById("userAvatar").innerText = role.avatar;

// Build navigation according to the logged-in role
const navList = document.getElementById("navList");

navList.innerHTML = role.menu.map(item => `
  <li>
    <a href="#" class="nav-link" onclick="loadView('${item.id}', '${item.label}', this); return false;">
      ${item.label}
    </a>
  </li>
`).join("");

// Open the first page automatically
if (role.menu.length > 0) {
  const firstItem = role.menu[0];

  currentViewId = firstItem.id;
  currentViewTitle = firstItem.label;

  document.getElementById("page-title").innerText = firstItem.label;

  const firstLink = navList.querySelector(".nav-link");
  if (firstLink) {
    firstLink.classList.add("active");
  }

  renderCurrentView();
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
                            · ${note.subject_code}
                            · Semester ${note.semester}
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
                            · ${assignment.subject_code}
                            · Semester ${assignment.semester}
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