from flask import Flask, render_template
from routes.auth import auth
from flask import Flask
from config import Config
from flask import Flask, render_template, session, jsonify
from extensions import db
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
    LeaveApplication
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

if __name__ == "__main__":
    app.run(debug=True)
