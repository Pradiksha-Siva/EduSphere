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

if __name__ == "__main__":
    app.run(debug=True)
