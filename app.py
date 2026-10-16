from config import Config
from flask import Flask, render_template
from routes.auth import auth
from flask import Flask, render_template, session, jsonify
from extensions import db
from flask import Flask, render_template, session, jsonify, request
from models import (
    Department,
    Staff,
    Student,
    Admin,
    Subject,
    Attendance,
    Marks,
    Assignment,
    Notes,
    Notice,
    Complaint,
    LeaveApplication,
    Timetable
)

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
app.register_blueprint(auth)

@app.route("/")
@app.route("/dashboard")
def dashboard():

    if "user_role" not in session:
        return "Please login first", 401

    department = None

    if session.get("department_id"):
        department = Department.query.get(
            session["department_id"]
        )

    return render_template(
        "dashboard.html",
        user_role=session.get("user_role"),
        user_name=session.get("user_name"),
        department_id=session.get("department_id"),
        department_name=(
            department.department_name
            if department
            else "Department Not Assigned"
        )
    )

@app.route("/api/notes")
def get_notes():

    if "user_role" not in session:
        return jsonify({"error": "Please login first"}), 401

    department_id = session.get("department_id")

    if not department_id:
        return jsonify({"error": "Department not assigned"}), 400

    notes = (
        Notes.query
        .join(Subject)
        .filter(Subject.department_id == department_id)
        .order_by(Notes.uploaded_at.desc())
        .all()
    )

    notes_data = []

    for note in notes:
        notes_data.append({
            "note_id": note.note_id,
            "title": note.title,
            "description": note.description,
            "file_url": note.file_url,
            "subject_name": note.subject.subject_name,
            "subject_code": note.subject.subject_code,
            "semester": note.subject.semester,
            "uploaded_at": (
                note.uploaded_at.strftime("%d %b %Y")
                if note.uploaded_at
                else ""
            )
        })

    return jsonify(notes_data)
@app.route("/api/assignments")
def get_assignments():

    if "user_role" not in session:
        return jsonify({"error": "Please login first"}), 401

    department_id = session.get("department_id")

    if not department_id:
        return jsonify({"error": "Department not assigned"}), 400

    assignments = (
        Assignment.query
        .join(Subject)
        .filter(Subject.department_id == department_id)
        .order_by(Assignment.due_date.asc())
        .all()
    )

    assignments_data = []

    for assignment in assignments:

        assignments_data.append({
            "assignment_id": assignment.assignment_id,
            "title": assignment.title,
            "description": assignment.description,
            "file_url": assignment.file_url,
            "due_date": (
                assignment.due_date.strftime("%d %b %Y")
                if assignment.due_date
                else ""
            ),
            "subject_name": assignment.subject.subject_name,
            "subject_code": assignment.subject.subject_code,
            "semester": assignment.subject.semester
        })

    return jsonify(assignments_data)

@app.route("/api/timetable")
def get_timetable():

    if "user_role" not in session:
        return jsonify({"error": "Please login first"}), 401

    if session.get("user_role") != "student":
        return jsonify({
            "error": "Student login required"
        }), 403

    student_id = session.get("user_id")

    student = Student.query.get(student_id)

    if not student:
        return jsonify({
            "error": "Student not found"
        }), 404

    timetable_entries = (
        Timetable.query
        .filter_by(
            department_id=student.department_id,
            academic_year=student.year,
            semester=student.semester,
            section=student.section
        )
        .order_by(
            Timetable.day_of_week,
            Timetable.period_number
        )
        .all()
    )

    timetable_data = []

    for entry in timetable_entries:
        timetable_data.append({
            "day_of_week": entry.day_of_week,
            "period_number": entry.period_number,
            "start_time": entry.start_time.strftime("%H:%M"),
            "end_time": entry.end_time.strftime("%H:%M"),
            "subject_name": entry.subject.subject_name,
            "staff_name": (
                entry.staff.staff_name
                if entry.staff else None
            ),
            "room_number": entry.room_number
        })

    return jsonify(timetable_data)

@app.route("/api/faculty/timetable")
def get_faculty_timetable():

    if "user_role" not in session:
        return jsonify({"error": "Please login first"}), 401

    if session.get("user_role") != "faculty":
        return jsonify({
            "error": "Faculty login required"
        }), 403

    staff_id = session.get("user_id")

    timetable_entries = (
        Timetable.query
        .filter_by(staff_id=staff_id)
        .order_by(
            Timetable.day_of_week,
            Timetable.period_number
        )
        .all()
    )

    timetable_data = []

    for entry in timetable_entries:
        timetable_data.append({
            "day_of_week": entry.day_of_week,
            "period_number": entry.period_number,
            "start_time": entry.start_time.strftime("%H:%M"),
            "end_time": entry.end_time.strftime("%H:%M"),
            "subject_name": (
                entry.subject.subject_name
                if entry.subject else None
            ),
            "academic_year": entry.academic_year,
            "semester": entry.semester,
            "section": entry.section,
            "room_number": entry.room_number
        })

    return jsonify(timetable_data)

@app.route("/api/faculty/subjects")
def get_faculty_subjects():

    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")

    subjects = (
        Subject.query
        .filter_by(staff_id=staff_id)
        .order_by(Subject.subject_name.asc())
        .all()
    )

    return jsonify([
        {
            "subject_id": subject.subject_id,
            "subject_name": subject.subject_name,
            "subject_code": subject.subject_code,
            "semester": subject.semester
        }
        for subject in subjects
    ])



@app.route("/api/faculty/marks/students")
def get_faculty_marks_students():
    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")
    subject_id = request.args.get("subject_id", type=int)
    academic_year = request.args.get("academic_year", type=int)
    section = request.args.get("section", type=str)

    if not subject_id or not academic_year or not section:
        return jsonify({
            "error": "Subject, year and section are required."
        }), 400

    if academic_year not in (1, 2, 3, 4):
        return jsonify({"error": "Invalid year."}), 400

    section = section.strip().upper()

    if section not in ("A", "B", "C"):
        return jsonify({"error": "Invalid section."}), 400

    subject = Subject.query.filter_by(
        subject_id=subject_id,
        staff_id=staff_id
    ).first()

    if not subject:
        return jsonify({"error": "Subject not assigned to you."}), 403

    timetable_rows = Timetable.query.filter_by(
        subject_id=subject_id,
        staff_id=staff_id,
        department_id=subject.department_id,
        academic_year=academic_year,
        semester=4,
        section=section
    ).all()

    students = []
    seen_ids = set()

    for timetable_row in timetable_rows:
        class_students = Student.query.filter_by(
            year=timetable_row.academic_year,
            semester=timetable_row.semester,
            section=timetable_row.section,
            department_id=timetable_row.department_id
        ).order_by(Student.register_no.asc()).all()

        for student in class_students:
            if student.student_id not in seen_ids:
                seen_ids.add(student.student_id)
                students.append({
                    "student_id": student.student_id,
                    "register_no": student.register_no,
                    "student_name": (
                        f"{student.first_name} {student.last_name or ''}"
                    ).strip()
                })

    return jsonify(students)



@app.route("/api/attendance")
def get_attendance():

    if "user_role" not in session:
        return jsonify({"error": "Please login first"}), 401

    student_id = session.get("user_id")

    if not student_id:
        return jsonify({"error": "Student not logged in"}), 400

    attendance_records = (
        Attendance.query
        .join(Subject)
        .filter(Attendance.student_id == student_id)
        .order_by(
            Attendance.attendance_date.desc()
        )
        .all()
    )

    if not attendance_records:
        return jsonify({
            "overall": {
                "present": 0,
                "total": 0,
                "percentage": 0
            },
            "subjects": [],
            "records": []
        })

    # --------------------------------
    # Overall attendance
    # --------------------------------

    total = len(attendance_records)

    present = sum(
        1
        for record in attendance_records
        if record.status == "Present"
    )

    overall_percentage = round(
        (present / total) * 100,
        2
    ) if total > 0 else 0


    # --------------------------------
    # Subject-wise attendance
    # --------------------------------

    subject_data = {}

    for record in attendance_records:

        subject_id = record.subject_id

        if subject_id not in subject_data:

            subject_data[subject_id] = {
                "subject_name": record.subject.subject_name,
                "subject_code": record.subject.subject_code,
                "present": 0,
                "total": 0
            }

        subject_data[subject_id]["total"] += 1

        if record.status == "Present":
            subject_data[subject_id]["present"] += 1


    subjects = []

    for subject in subject_data.values():

        percentage = round(
            (subject["present"] / subject["total"]) * 100,
            2
        ) if subject["total"] > 0 else 0

        subjects.append({
            "subject_name": subject["subject_name"],
            "subject_code": subject["subject_code"],
            "present": subject["present"],
            "total": subject["total"],
            "percentage": percentage
        })


    # --------------------------------
    # Individual attendance records
    # --------------------------------

    records = []

    for record in attendance_records:

        records.append({
            "subject_name": record.subject.subject_name,
            "subject_code": record.subject.subject_code,
            "date": (
                record.attendance_date.strftime("%d %b %Y")
                if record.attendance_date
                else ""
            ),
            "status": record.status
        })


    return jsonify({
        "overall": {
            "present": present,
            "total": total,
            "percentage": overall_percentage
        },
        "subjects": subjects,
        "records": records
    })

@app.route("/api/leave-applications", methods=["GET"])
def get_leave_applications():
    if session.get("user_role") != "student":
        return jsonify({"error": "Student login required"}), 403

    student_id = session.get("user_id")

    applications = (
        LeaveApplication.query
        .filter_by(student_id=student_id)
        .order_by(LeaveApplication.applied_at.desc())
        .all()
    )

    return jsonify([
        {
            "leave_id": item.leave_id,
            "from_date": item.from_date.isoformat() if item.from_date else "",
            "to_date": item.to_date.isoformat() if item.to_date else "",
            "reason": item.reason or "",
            "status": item.status or "Pending",
            "applied_at": (
                item.applied_at.strftime("%d %b %Y")
                if item.applied_at else ""
            )
        }
        for item in applications
    ])





if __name__ == "__main__":
    app.run(debug=True)
