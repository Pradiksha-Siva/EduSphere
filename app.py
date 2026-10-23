import os
import uuid
from werkzeug.utils import secure_filename
from flask import send_from_directory
from dotenv import load_dotenv
load_dotenv()
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
    Timetable,
    Document,
    Submission
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


@app.route("/api/faculty/department-timetables")
def get_department_timetables():

    if "user_role" not in session:
        return jsonify({"error": "Please login first"}), 401

    if session.get("user_role") != "faculty":
        return jsonify({
            "error": "Faculty login required"
        }), 403

    staff_id = session.get("user_id")
    staff = Staff.query.get(staff_id)

    if not staff:
        return jsonify({"error": "Faculty not found"}), 404

    timetable_entries = (
        Timetable.query
        .filter_by(department_id=staff.department_id)
        .order_by(
            Timetable.academic_year,
            Timetable.semester,
            Timetable.section,
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
            "staff_name": (
                entry.staff.staff_name
                if entry.staff else None
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

@app.route("/api/faculty/submission-filters", methods=["GET"])
def get_faculty_submission_filters():
    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")

    staff = Staff.query.filter_by(staff_id=staff_id).first()

    if staff is None:
        return jsonify({"error": "Faculty not found"}), 404

    subjects = (
        Subject.query
        .filter_by(staff_id=staff_id)
        .order_by(Subject.subject_name.asc())
        .all()
    )

    years = [
        row[0]
        for row in db.session.query(Student.year)
        .filter(
            Student.department_id == staff.department_id,
            Student.year.isnot(None)
        )
        .distinct()
        .order_by(Student.year.asc())
        .all()
    ]

    sections = [
        row[0]
        for row in db.session.query(Student.section)
        .filter(
            Student.department_id == staff.department_id,
            Student.section.isnot(None)
        )
        .distinct()
        .order_by(Student.section.asc())
        .all()
    ]

    return jsonify({
        "department_id": staff.department_id,
        "department_name": (
            staff.department.department_name
            if staff.department else ""
        ),
        "years": years,
        "sections": sections,
        "subjects": [
            {
                "subject_id": subject.subject_id,
                "subject_name": subject.subject_name,
                "semester": subject.semester
            }
            for subject in subjects
        ]
    }), 200



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
@app.route("/api/documents", methods=["POST"])
def upload_document():
    if session.get("user_role") != "student":
        return jsonify({"error": "Student login required"}), 403

    document_name = request.form.get("document_name", "").strip()
    document_type = request.form.get("document_type", "").strip()
    file = request.files.get("document_file")

    if not document_name or not document_type or not file:
        return jsonify({"error": "All fields are required."}), 400

    allowed_extensions = {"pdf", "jpg", "jpeg", "png"}
    extension = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""

    if extension not in allowed_extensions:
        return jsonify({"error": "Only PDF, JPG and PNG files are allowed."}), 400

    upload_folder = os.path.join(app.instance_path, "student_documents")
    os.makedirs(upload_folder, exist_ok=True)

    original_filename = secure_filename(file.filename)

    if not original_filename:
        return jsonify({"error": "Invalid filename."}), 400

    stored_filename = f"{uuid.uuid4().hex}.{extension}"
    file_path = os.path.join(upload_folder, stored_filename)

    try:
        file.save(file_path)

        document = Document(
            student_id=session["user_id"],
            document_name=document_name,
            document_type=document_type,
            original_filename=original_filename,
            stored_filename=stored_filename,
            status="Pending"
        )

        db.session.add(document)
        db.session.commit()

        return jsonify({
            "message": "Document uploaded successfully.",
            "document_id": document.document_id
        }), 201

    except Exception:
        db.session.rollback()

        if os.path.exists(file_path):
            os.remove(file_path)

        app.logger.exception("Document upload failed")
        return jsonify({"error": "Upload failed. Please try again."}), 500

@app.route("/api/documents", methods=["GET"])
def get_student_documents():
    if session.get("user_role") != "student":
        return jsonify({"error": "Student login required"}), 403

    documents = Document.query.filter_by(
        student_id=session["user_id"]
    ).order_by(Document.uploaded_at.desc()).all()

    return jsonify([
        {
            "document_id": doc.document_id,
            "document_name": doc.document_name,
            "document_type": doc.document_type,
            "original_filename": doc.original_filename,
            "status": doc.status,
            "uploaded_at": doc.uploaded_at.strftime("%d %b %Y, %I:%M %p")
        }
        for doc in documents
    ]), 200


@app.route("/api/documents/<int:document_id>/download", methods=["GET"])
def download_student_document(document_id):
    if session.get("user_role") != "student":
        return jsonify({"error": "Student login required"}), 403

    document = Document.query.filter_by(
        document_id=document_id,
        student_id=session["user_id"]
    ).first()

    if document is None:
        return jsonify({"error": "Document not found"}), 404

    upload_folder = os.path.join(
        app.instance_path,
        "student_documents"
    )

    return send_from_directory(
        upload_folder,
        document.stored_filename,
        as_attachment=True,
        download_name=document.original_filename
    )

@app.route("/api/assignment-submissions/<int:submission_id>/download", methods=["GET"])
def download_assignment_submission(submission_id):
    role = session.get("user_role")
    user_id = session.get("user_id")

    if role not in ["student", "faculty"]:
        return jsonify({"error": "Login required"}), 403

    submission = Submission.query.filter_by(
        submission_id=submission_id
    ).first()

    if submission is None:
        return jsonify({"error": "Submission not found"}), 404

    # Students can download only their own submissions
    if role == "student":
        if submission.student_id != user_id:
            return jsonify({"error": "Access denied"}), 403

    # Faculty can download submissions only for their assigned subjects
    elif role == "faculty":
        assignment = Assignment.query.filter_by(
            assignment_id=submission.assignment_id
        ).join(Subject).filter(
            Subject.staff_id == user_id
        ).first()

        if assignment is None:
            return jsonify({"error": "Access denied"}), 403

    upload_folder = os.path.join(
        app.instance_path,
        "assignment_submissions"
    )

    return send_from_directory(
        upload_folder,
        submission.stored_filename,
        as_attachment=True,
        download_name=submission.original_filename
    )



@app.route("/api/assignment-submissions", methods=["POST"])
def submit_assignment():
    if session.get("user_role") != "student":
        return jsonify({"error": "Student login required"}), 403

    student_id = session.get("user_id")
    assignment_id = request.form.get("assignment_id", type=int)
    file = request.files.get("submission_file")

    if not student_id:
        return jsonify({"error": "Student session not found"}), 401

    if not assignment_id or not file or not file.filename:
        return jsonify({
            "error": "Assignment and submission file are required."
        }), 400

    assignment = (
        Assignment.query
        .join(Subject)
        .join(Student, Student.department_id == Subject.department_id)
        .filter(
            Assignment.assignment_id == assignment_id,
            Student.student_id == student_id
        )
        .first()
    )

    if not assignment:
        return jsonify({"error": "Assignment not found"}), 404

    allowed_extensions = {"pdf", "doc", "docx", "ppt", "pptx"}
    original_filename = secure_filename(file.filename)

    if (
        not original_filename
        or "." not in original_filename
        or original_filename.rsplit(".", 1)[-1].lower()
        not in allowed_extensions
    ):
        return jsonify({
            "error": "Upload a PDF, DOC, DOCX, PPT or PPTX file."
        }), 400

    extension = original_filename.rsplit(".", 1)[-1].lower()
    stored_filename = f"{uuid.uuid4().hex}.{extension}"

    upload_folder = os.path.join(
        app.instance_path, "assignment_submissions"
    )
    os.makedirs(upload_folder, exist_ok=True)

    file_path = os.path.join(upload_folder, stored_filename)

    try:
        file.save(file_path)

        submission = Submission(
            assignment_id=assignment_id,
            student_id=student_id,
            original_filename=original_filename,
            stored_filename=stored_filename,
            status="Submitted"
        )

        db.session.add(submission)
        db.session.commit()

        return jsonify({
            "message": "Assignment submitted successfully.",
            "submission_id": submission.submission_id
        }), 201

    except Exception:
        db.session.rollback()

        if os.path.exists(file_path):
            os.remove(file_path)

        app.logger.exception("Assignment submission failed")
        return jsonify({
            "error": "Submission failed. Please try again."
        }), 500

@app.route("/api/assignment-submissions", methods=["GET"])
def get_assignment_submissions():
    if session.get("user_role") != "student":
        return jsonify({"error": "Student login required"}), 403

    student_id = session.get("user_id")

    submissions = (
        Submission.query
        .filter_by(student_id=student_id)
        .order_by(Submission.submitted_at.desc())
        .all()
    )

    return jsonify([
        {
            "submission_id": item.submission_id,
            "assignment_id": item.assignment_id,
            "assignment_title": item.assignment.title,
            "original_filename": item.original_filename,
            "submitted_at": (
                item.submitted_at.strftime("%d %b %Y, %I:%M %p")
                if item.submitted_at else ""
            ),
            "status": item.status
        }
        for item in submissions
    ]), 200

@app.route("/api/faculty/assignment-submissions", methods=["GET"])
def get_faculty_assignment_submissions():
    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")

    staff = Staff.query.filter_by(staff_id=staff_id).first()
    if staff is None:
        return jsonify({"error": "Faculty not found"}), 404

    query = (
        Submission.query
        .join(Assignment, Submission.assignment_id == Assignment.assignment_id)
        .join(Subject, Assignment.subject_id == Subject.subject_id)
        .join(Student, Submission.student_id == Student.student_id)
        .filter(
            Subject.staff_id == staff_id,
            Subject.department_id == staff.department_id,
            Student.department_id == staff.department_id
        )
    )

    year = request.args.get("year", type=int)
    section = request.args.get("section")
    subject_id = request.args.get("subject_id", type=int)
    assignment_id = request.args.get("assignment_id", type=int)

    if year is not None:
        query = query.filter(Student.year == year)

    if section:
        query = query.filter(Student.section == section)

    if subject_id is not None:
        query = query.filter(Subject.subject_id == subject_id)

    if assignment_id is not None:
        query = query.filter(Assignment.assignment_id == assignment_id)

    submissions = query.order_by(Submission.submitted_at.desc()).all()

    return jsonify([
        {
            "submission_id": item.submission_id,
            "assignment_id": item.assignment_id,
            "assignment_title": item.assignment.title,
            "subject_name": item.assignment.subject.subject_name,
            "student_id": item.student_id,
            "student_name": (
                f"{item.student.first_name} {item.student.last_name or ''}".strip()
            ),
            "register_no": item.student.register_no,
            "original_filename": item.original_filename,
            "submitted_at": (
                item.submitted_at.strftime("%d %b %Y, %I:%M %p")
                if item.submitted_at else ""
            ),
            "status": item.status
        }
        for item in submissions
    ]), 200

@app.route(
    "/api/faculty/subject-assignments/<int:subject_id>",
    methods=["GET"]
)
def get_faculty_subject_assignments(subject_id):
    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")

    subject = Subject.query.filter_by(
        subject_id=subject_id,
        staff_id=staff_id
    ).first()

    if subject is None:
        return jsonify({"error": "Subject not found or access denied"}), 404

    assignments = Assignment.query.filter_by(
        subject_id=subject_id,
        staff_id=staff_id
    ).order_by(Assignment.title.asc()).all()

    return jsonify([
        {
            "assignment_id": item.assignment_id,
            "title": item.title
        }
        for item in assignments
    ]), 200

with app.app_context():
    db.create_all()



if __name__ == "__main__":
    app.run(debug=True)
