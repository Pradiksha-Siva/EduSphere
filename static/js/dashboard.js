
const roleConfig = {
  student: {
    label: "Student", avatar: "S",
    menu: [
      { id: "std-dashboard", label: "Dashboard" },
      { id: "std-notes", label: "Notes" },
      { id: "std-assignments", label: "Assignments" },
      { id: "std-announcements", label: "Announcements" },
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
      { id: "fac-queue", label: "Approval Queue" },
      { id: "fac-upload", label: "Upload Notes" },
      { id: "fac-announce", label: "Post Announcement" },
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

let currentRole = 'student';
let currentDept = 'AI & DS';

function onDeptChange() {
  currentDept = document.getElementById('deptSelect').value;
  document.getElementById('deptPill').innerText = currentDept;
  renderCurrentView();
}

function onRoleChange() {
  currentRole = document.getElementById('roleSelect').value;
  const cfg = roleConfig[currentRole];
  document.getElementById('userName').innerText = cfg.label + " User";
  document.getElementById('userRole').innerText = cfg.label;
  document.getElementById('userAvatar').innerText = cfg.avatar;

  const navList = document.getElementById('navList');
  navList.innerHTML = '';
  cfg.menu.forEach((item, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<a class="nav-link ${i === 0 ? 'active' : ''}" data-view="${item.id}" onclick="loadView('${item.id}','${item.label}', this)">${item.label}</a>`;
    navList.appendChild(li);
  });
  loadView(cfg.menu[0].id, cfg.menu[0].label);
}

let currentViewId = null, currentViewTitle = null;
function loadView(viewId, title, el) {
  currentViewId = viewId; currentViewTitle = title;
  document.getElementById('page-title').innerText = title;
  if (el) {
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
  }
  renderCurrentView();
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
        <div class="grid">
          <div class="card item-card">${seal('approved')}<h4>Unit 3 Notes</h4><div class="meta">${dept} · Semester 5</div></div>
          <div class="card item-card">${seal('approved')}<h4>Lab Manual — Module 2</h4><div class="meta">${dept} · Semester 5</div></div>
        </div>
        <p style="color:var(--muted); font-size:12px; margin-top:4px;">Only faculty-approved notes appear here — representative uploads show up once reviewed.</p>`;

    case 'std-assignments':
      return `
        <table>
          <tr><th>Title</th><th>Subject</th><th>Due</th><th></th></tr>
          <tr><td>SQL Queries Practice</td><td>Database Systems</td><td>Oct 25</td><td><button class="btn btn-outline">Download</button></td></tr>
          <tr><td>Project Prototype</td><td>Web Development</td><td>Oct 28</td><td><button class="btn btn-outline">Download</button></td></tr>
        </table>`;

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

onRoleChange();
