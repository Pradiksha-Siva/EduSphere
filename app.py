import os
import uuid
from werkzeug.utils import secure_filename
from flask import send_from_directory
from dotenv import load_dotenv
load_dotenv()
from io import BytesIO
from flask import send_file
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from config import Config
from flask import Flask, render_template
from routes.auth import auth
from flask import Flask, render_template, session, jsonify
from extensions import db
from flask import Flask, render_template, session, jsonify, request
from datetime import datetime
from models import (
    ClassAdvisor,
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
    Submission,
    StudentVoice,
    LeaveApprovalVisit
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

@app.route("/api/faculty/notes", methods=["POST"])
def upload_faculty_note():

    # Only faculty can upload notes
    if session.get("user_role") != "faculty":
        return jsonify({
            "error": "Faculty login required"
        }), 403

    staff_id = session.get("user_id")

    if not staff_id:
        return jsonify({
            "error": "Faculty session not found"
        }), 401

    # Get form data
    subject_id = request.form.get("subject_id", type=int)
    title = request.form.get("title", "").strip()
    description = request.form.get("description", "").strip()
    file = request.files.get("file")

    # Validate required fields
    if not subject_id or not title or not file or not file.filename:
        return jsonify({
            "error": "Subject, title and file are required."
        }), 400

    # Verify that this subject belongs to the logged-in faculty
    subject = Subject.query.filter_by(
        subject_id=subject_id,
        staff_id=staff_id
    ).first()

    if subject is None:
        return jsonify({
            "error": "You are not authorized to upload notes for this subject."
        }), 403

    # Validate file
    allowed_extensions = {
        "pdf",
        "doc",
        "docx",
        "ppt",
        "pptx"
    }

    original_filename = secure_filename(file.filename)

    if (
        not original_filename
        or "." not in original_filename
        or original_filename.rsplit(".", 1)[-1].lower()
        not in allowed_extensions
    ):
        return jsonify({
            "error": (
                "Upload a PDF, DOC, DOCX, PPT or PPTX file."
            )
        }), 400

    # Create a unique filename
    extension = original_filename.rsplit(
        ".", 1
    )[-1].lower()

    stored_filename = (
        f"{uuid.uuid4().hex}.{extension}"
    )

    # Create notes upload folder
    upload_folder = os.path.join(
        app.instance_path,
        "notes"
    )

    os.makedirs(
        upload_folder,
        exist_ok=True
    )

    file_path = os.path.join(
        upload_folder,
        stored_filename
    )

    try:
        # Save the file
        file.save(file_path)

        # Save note details in database
        note = Notes(
            subject_id=subject_id,
            staff_id=staff_id,
            title=title,
            description=description,
            file_url=stored_filename,
            uploaded_at=datetime.now()
        )

        db.session.add(note)
        db.session.commit()

        return jsonify({
            "message": "Note uploaded successfully.",
            "note_id": note.note_id
        }), 201

    except Exception:

        db.session.rollback()

        # Remove the uploaded file if database saving fails
        if os.path.exists(file_path):
            os.remove(file_path)

        app.logger.exception(
            "Faculty note upload failed"
        )

        return jsonify({
            "error": (
                "Unable to upload the note. "
                "Please try again."
            )
        }), 500
@app.route("/api/faculty/notes", methods=["GET"])
def get_faculty_notes():

    if session.get("user_role") != "faculty":
        return jsonify({
            "error": "Faculty login required"
        }), 403

    staff_id = session.get("user_id")

    if not staff_id:
        return jsonify({
            "error": "Faculty session not found"
        }), 401

    notes = (
        Notes.query
        .filter_by(staff_id=staff_id)
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

            "subject_name": (
                note.subject.subject_name
                if note.subject
                else ""
            ),

            "subject_code": (
                note.subject.subject_code
                if note.subject
                else ""
            ),

            "uploaded_at": (
                note.uploaded_at.strftime(
                    "%d %b %Y, %I:%M %p"
                )
                if note.uploaded_at
                else ""
            )
        })

    return jsonify(notes_data), 200

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

@app.route("/api/faculty/attendance/classes", methods=["GET"])
def get_faculty_attendance_classes():

    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")

    advisor_classes = (
        ClassAdvisor.query
        .filter_by(staff_id=staff_id)
        .all()
    )

    return jsonify([
        {
            "department_id": advisor.department_id,
            "academic_year": advisor.academic_year,
            "section": advisor.section
        }
        for advisor in advisor_classes
    ]), 200




@app.route("/api/faculty/attendance/students", methods=["GET"])
def get_faculty_attendance_students():

    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")
    subject_id = request.args.get("subject_id", type=int)

    # Subject-wise attendance
    if subject_id is not None:

        subject = Subject.query.filter_by(
            subject_id=subject_id,
            staff_id=staff_id
        ).first()

        if subject is None:
            return jsonify({
                "error": "You are not assigned to this subject."
            }), 403

        students = (
            Student.query
            .filter_by(
                department_id=subject.department_id,
                semester=subject.semester
            )
            .order_by(Student.register_no.asc())
            .all()
        )

    # Overall class attendance
    else:

        advisor = ClassAdvisor.query.filter_by(
            staff_id=staff_id
        ).first()

        if advisor is None:
            return jsonify({
                "error": "You are not a class advisor."
            }), 403

        students = (
            Student.query
            .filter_by(
                department_id=advisor.department_id,
                year=advisor.academic_year,
                section=advisor.section
            )
            .order_by(Student.register_no.asc())
            .all()
        )

    return jsonify([
        {
            "student_id": student.student_id,
            "register_no": student.register_no,
            "student_name": (
                f"{student.first_name} {student.last_name or ''}"
            ).strip()
        }
        for student in students
    ]), 200


@app.route("/api/faculty/attendance/overall", methods=["POST"])
def save_overall_attendance():

    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")

    advisor = ClassAdvisor.query.filter_by(
        staff_id=staff_id
    ).first()

    if advisor is None:
        return jsonify({"error": "You are not a class advisor."}), 403

    data = request.get_json(silent=True) or {}
    attendance_date = data.get("attendance_date")
    records = data.get("records")

    if not attendance_date or not isinstance(records, list) or not records:
        return jsonify({
            "error": "Attendance date and student records are required."
        }), 400

    try:
        attendance_date = __import__("datetime").date.fromisoformat(
            attendance_date
        )
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid attendance date."}), 400

    valid_statuses = {"Present", "Absent", "Leave", "OD"}
    student_ids = set()

    for item in records:
        if not isinstance(item, dict):
            return jsonify({"error": "Invalid attendance record."}), 400

        student_id = item.get("student_id")
        status = item.get("status")

        if not isinstance(student_id, int) or status not in valid_statuses:
            return jsonify({"error": "Invalid student ID or status."}), 400

        if student_id in student_ids:
            return jsonify({"error": "Duplicate student in request."}), 400

        student_ids.add(student_id)

    students = Student.query.filter(
        Student.student_id.in_(student_ids),
        Student.department_id == advisor.department_id,
        Student.year == advisor.academic_year,
        Student.section == advisor.section
    ).all()

    if len(students) != len(student_ids):
        return jsonify({
            "error": "One or more students do not belong to your assigned class."
        }), 403

    existing_records = Attendance.query.filter(
        Attendance.student_id.in_(student_ids),
        Attendance.attendance_date == attendance_date,
        Attendance.attendance_type == "Overall"
    ).all()

    if existing_records:
        return jsonify({
            "error": "Overall attendance already exists for one or more students on this date."
        }), 409

    try:
        for item in records:
            db.session.add(Attendance(
                student_id=item["student_id"],
                subject_id=None,
                attendance_date=attendance_date,
                status=item["status"],
                marked_by=staff_id,
                attendance_type="Overall"
            ))

        db.session.commit()

    except Exception:
        db.session.rollback()
        app.logger.exception("Failed to save overall attendance")
        return jsonify({"error": "Failed to save attendance."}), 500

    return jsonify({
        "message": "Overall attendance saved successfully.",
        "saved_count": len(records)
    }), 201

@app.route("/api/faculty/marks/students")
def get_faculty_marks_students():
    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")
    subject_id = request.args.get("subject_id", type=int)
    academic_year = request.args.get("academic_year", type=int)
    semester = request.args.get("semester", type=int)
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
        semester=semester,
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



from datetime import datetime

@app.route("/api/faculty/marks/existing", methods=["GET"])
def get_existing_faculty_marks():
    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")

    subject_id = request.args.get("subject_id", type=int)
    academic_year = request.args.get("academic_year", type=int)
    section = request.args.get("section", "").strip().upper()
    exam_type = request.args.get("exam_type", "").strip()
    semester = request.args.get("semester", type=int)
    if not all([subject_id, academic_year, semester, section, exam_type]):
        return jsonify({
            "error": "Subject, year, semester, section and examination are required."
        }), 400

    if academic_year not in (1, 2, 3, 4):
        return jsonify({"error": "Invalid academic year."}), 400

    if section not in ("A", "B", "C"):
        return jsonify({"error": "Invalid section."}), 400

    subject = Subject.query.filter_by(
        subject_id=subject_id,
        staff_id=staff_id
    ).first()

    if subject is None:
        return jsonify({"error": "Subject not assigned to you."}), 403

    marks = (
        Marks.query
        .join(Student, Marks.student_id == Student.student_id)
        .filter(
            Marks.subject_id == subject_id,
            Marks.staff_id == staff_id,
            Marks.exam_type == exam_type,
            Student.department_id == subject.department_id,
            Student.year == academic_year,
            Student.semester == semester,  
            Marks.academic_year == academic_year,
            Marks.semester == semester,
            Student.section == section
        )
        .all()
    )

    return jsonify([
        {
            "student_id": mark.student_id,
            "marks_obtained": float(mark.marks_obtained),
            "maximum_marks": float(mark.maximum_marks),
            "is_published": mark.is_published
        }
        for mark in marks
    ]), 200

@app.route("/api/faculty/marks", methods=["POST"])
def save_faculty_marks():
    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")
    data = request.get_json(silent=True) or {}

    subject_id = data.get("subject_id")
    academic_year = data.get("academic_year")
    semester = data.get("semester")
    semester = int(semester)
    section = data.get("section")
    exam_type = data.get("exam_type")
    maximum_marks = data.get("maximum_marks")
    records = data.get("records")

    if not all([
        subject_id, academic_year, section,
        exam_type, maximum_marks
    ]) or not isinstance(records, list) or not records:
        return jsonify({
            "error": "All fields and student marks are required."
        }), 400

    try:
        subject_id = int(subject_id)
        academic_year = int(academic_year)
        maximum_marks = float(maximum_marks)
        section = str(section).strip().upper()
        exam_type = str(exam_type).strip()

        if academic_year not in (1, 2, 3, 4):
            raise ValueError("Invalid academic year.")

        if section not in ("A", "B", "C"):
            raise ValueError("Invalid section.")

        if not exam_type:
            raise ValueError("Examination type cannot be empty.")

        if maximum_marks <= 0:
            raise ValueError("Maximum marks must be greater than zero.")

        subject = Subject.query.filter_by(
            subject_id=subject_id,
            staff_id=staff_id
        ).first()

        if subject is None:
            return jsonify({
                "error": "Subject not assigned to you."
            }), 403

        timetable_entry = Timetable.query.filter_by(
            subject_id=subject_id,
            staff_id=staff_id,
            department_id=subject.department_id,
            academic_year=academic_year,
            semester=semester,
            section=section
        ).first()

        if timetable_entry is None:
            return jsonify({
                "error": "No matching class assignment found."
            }), 403

        student_ids = set()
        validated_records = []

        for item in records:
            student_id = int(item["student_id"])
            obtained = float(item["marks_obtained"])

            if student_id in student_ids:
                return jsonify({
                    "error": "Duplicate student in submission."
                }), 400

            if obtained < 0 or obtained > maximum_marks:
                return jsonify({
                    "error": "Marks must be between zero and maximum marks."
                }), 400

            student_ids.add(student_id)
            validated_records.append((student_id, obtained))

        students = Student.query.filter(
            Student.student_id.in_(student_ids),
            Student.department_id == subject.department_id,
            Student.year == academic_year,
            Student.semester == semester,
            Student.section == section
        ).all()

        if len(students) != len(student_ids):
            return jsonify({
                "error": "One or more students do not belong to this class."
            }), 403

        inserted_count = 0
        updated_count = 0

        for student_id, obtained in validated_records:
            mark = Marks.query.filter_by(
                student_id=student_id,
                subject_id=subject_id,
                exam_type=exam_type,
                academic_year=academic_year,
                semester=semester
            ).first()
            if mark:
                mark.marks_obtained = obtained
                mark.maximum_marks = maximum_marks
                mark.staff_id = staff_id

                mark.academic_year = academic_year
                mark.semester = semester

                updated_count += 1
            else:
                db.session.add(Marks(
                student_id=student_id,
                subject_id=subject_id,
                exam_type=exam_type,
                marks_obtained=obtained,
                maximum_marks=maximum_marks,
                staff_id=staff_id,
                academic_year=academic_year,
                semester=semester,
                created_at=datetime.now(),
                is_published=False
            ))
            inserted_count += 1

        db.session.commit()

        return jsonify({
            "message": "Marks saved successfully.",
            "inserted_count": inserted_count,
            "updated_count": updated_count,
            "saved_count": len(validated_records)
        }), 200

    except (ValueError, TypeError, KeyError) as error:
        db.session.rollback()
        return jsonify({"error": str(error)}), 400

    except Exception:
        db.session.rollback()
        app.logger.exception("Failed to save marks")
        return jsonify({"error": "Failed to save marks."}), 500



@app.route("/api/faculty/marks/publish", methods=["POST"])
def publish_faculty_marks():
    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")
    data = request.get_json(silent=True) or {}

    subject_id = data.get("subject_id")
    exam_type = data.get("exam_type")
    academic_year = data.get("academic_year")
    section = data.get("section")

    if not all([subject_id, exam_type, academic_year, section]):
        return jsonify({
            "error": "Subject, exam type, academic year and section are required."
        }), 400

    try:
        subject_id = int(subject_id)
        academic_year = int(academic_year)
        exam_type = str(exam_type).strip()
        section = str(section).strip().upper()

        if academic_year not in (1, 2, 3, 4):
            return jsonify({"error": "Invalid academic year."}), 400

        if section not in ("A", "B", "C"):
            return jsonify({"error": "Invalid section."}), 400

        if not exam_type:
            return jsonify({"error": "Exam type cannot be empty."}), 400

        subject = Subject.query.filter_by(
            subject_id=subject_id,
            staff_id=staff_id
        ).first()

        if subject is None:
            return jsonify({
                "error": "Subject not assigned to you."
            }), 403

        marks = (
            Marks.query
            .join(Student, Marks.student_id == Student.student_id)
            .filter(
                Marks.subject_id == subject_id,
                Marks.staff_id == staff_id,
                Marks.exam_type == exam_type,
                Student.department_id == subject.department_id,
                Student.year == academic_year,
                Student.semester == 4,
                Student.section == section
            )
            .all()
        )

        if not marks:
            return jsonify({
                "error": "No marks found for this class and examination."
            }), 404

        for mark in marks:
            mark.is_published = True

        db.session.commit()

        return jsonify({
            "message": "Marks published successfully.",
            "published_count": len(marks)
        }), 200

    except (ValueError, TypeError):
        db.session.rollback()
        return jsonify({"error": "Invalid publishing details."}), 400

    except Exception:
        db.session.rollback()
        app.logger.exception("Failed to publish marks")
        return jsonify({"error": "Failed to publish marks."}), 500



@app.route("/api/faculty/class-marks", methods=["GET"])
def get_faculty_class_marks():

    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")

    advisor = ClassAdvisor.query.filter_by(
        staff_id=staff_id
    ).first()

    if advisor is None:
        return jsonify({
            "error": "You are not assigned as a class advisor."
        }), 403

    # Get filter parameters
    batch = request.args.get("batch", "").strip()
    year = request.args.get("year", type=int)
    semester = request.args.get("semester", type=int)
    exam_type = request.args.get("exam_type", "").strip()

    # Validate batch
    if not batch:
        return jsonify({"error": "Batch is required."}), 400

    if batch != advisor.batch:
        return jsonify({
            "error": "You are not authorized to access this batch."
        }), 403

    # Validate academic year
    if year not in [1, 2, 3, 4]:
        return jsonify({
            "error": "Invalid academic year."
        }), 400

    # Validate semester
    semester_mapping = {
        1: [1, 2],
        2: [3, 4],
        3: [5, 6],
        4: [7, 8]
}

    if semester not in semester_mapping[year]:
        return jsonify({"error": "Invalid semester for the selected year."}), 400
   
    # Validate examination
    valid_exams = {
        "First Internal",
        "Second Internal",
        "Third Internal",
        "Semester Examination"
    }

    if exam_type not in valid_exams:
        return jsonify({
            "error": "Invalid examination type."
        }), 400

    # Get students from the advisor's assigned batch only
    students = (
    Student.query
    .filter(
        Student.department_id == advisor.department_id,
        Student.section == advisor.section,
        Student.batch == advisor.batch
    )
    .order_by(Student.register_no.asc())
    .all()
)

    if not students:
        return jsonify({
            "error": "No students found for the selected batch, year and semester."
        }), 404

    student_ids = [student.student_id for student in students]

    # Get all subjects scheduled for this class and semester
    timetable_subjects = (
        Timetable.query
        .filter(
            Timetable.department_id == advisor.department_id,
            Timetable.academic_year == year,
            Timetable.section == advisor.section,
            Timetable.semester == semester
        )
        .all()
    )

    subject_ids = list({
        entry.subject_id
        for entry in timetable_subjects
    })

    subjects = (
        Subject.query
        .filter(Subject.subject_id.in_(subject_ids))
        .order_by(Subject.subject_name.asc())
        .all()
    ) if subject_ids else []

    # Get marks for all students and all class subjects
    marks = (
    Marks.query
    .filter(
        Marks.student_id.in_(student_ids),
        Marks.subject_id.in_(subject_ids),
        Marks.academic_year == year,
        Marks.semester == semester,
        Marks.exam_type == exam_type
    )
    .all()
) if subject_ids else []

    return jsonify({
        "class": {
            "department_id": advisor.department_id,
            "batch": advisor.batch,
            "academic_year": year,
            "semester": semester,
            "section": advisor.section,
            "exam_type": exam_type
        },

        "students": [
            {
                "student_id": student.student_id,
                "register_no": student.register_no,
                "student_name": (
                    f"{student.first_name} {student.last_name or ''}"
                ).strip()
            }
            for student in students
        ],

        "subjects": [
            {
                "subject_id": subject.subject_id,
                "subject_code": subject.subject_code,
                "subject_name": subject.subject_name
            }
            for subject in subjects
        ],

        "marks": [
            {
                "student_id": mark.student_id,
                "subject_id": mark.subject_id,
                "marks_obtained": (
                    float(mark.marks_obtained)
                    if mark.marks_obtained is not None
                    else None
                ),
                "maximum_marks": (
                    float(mark.maximum_marks)
                    if mark.maximum_marks is not None
                    else None
                )
            }
            for mark in marks
        ]
    }), 200


@app.route("/api/faculty/class-marks/export", methods=["GET"])
def export_faculty_class_marks():

    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")

    advisor = ClassAdvisor.query.filter_by(
        staff_id=staff_id
    ).first()

    if advisor is None:
        return jsonify({
            "error": "You are not assigned as a class advisor."
        }), 403

    year = request.args.get("year", type=int)
    semester = request.args.get("semester", type=int)
    exam_type = request.args.get("exam_type", "").strip()

    if year not in (1, 2, 3, 4):
        return jsonify({"error": "Invalid academic year."}), 400

    semester_mapping = {
        1: [1, 2],
        2: [3, 4],
        3: [5, 6],
        4: [7, 8]
    }

    if semester not in semester_mapping[year]:
        return jsonify({"error": "Invalid semester."}), 400

    if exam_type not in {
        "First Internal",
        "Second Internal",
        "Third Internal",
        "Semester Examination"
    }:
        return jsonify({"error": "Invalid examination type."}), 400

    # Get all students belonging to the advisor's batch
    students = (
        Student.query
        .filter_by(
            department_id=advisor.department_id,
            section=advisor.section,
            batch=advisor.batch
        )
        .order_by(Student.register_no.asc())
        .all()
    )

    student_ids = [student.student_id for student in students]

    # Get subjects for the selected year and semester
    timetable_entries = (
        Timetable.query
        .filter_by(
            department_id=advisor.department_id,
            academic_year=year,
            semester=semester,
            section=advisor.section
        )
        .all()
    )

    subject_ids = list({
        entry.subject_id for entry in timetable_entries
    })

    subjects = (
        Subject.query
        .filter(Subject.subject_id.in_(subject_ids))
        .order_by(Subject.subject_name.asc())
        .all()
    ) if subject_ids else []

    # Get marks for the selected examination
    marks = (
        Marks.query
        .filter(
            Marks.student_id.in_(student_ids),
            Marks.subject_id.in_(subject_ids),
            Marks.academic_year == year,
            Marks.semester == semester,
            Marks.exam_type == exam_type
        )
        .all()
    ) if student_ids and subject_ids else []

    marks_map = {
        (mark.student_id, mark.subject_id): mark.marks_obtained
        for mark in marks
    }

    # Create Excel workbook
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Class Marks"

    # Title
    total_columns = len(subjects) + 2

    sheet.merge_cells(
        start_row=1,
        start_column=1,
        end_row=1,
        end_column=total_columns
    )

    title_cell = sheet.cell(
        row=1,
        column=1,
        value="EDUSPHERE - CLASS MARKSHEET"
    )

    title_cell.font = Font(
        bold=True,
        size=16,
        color="FFFFFF"
    )

    title_cell.fill = PatternFill(
        "solid",
        fgColor="17365D"
    )

    title_cell.alignment = Alignment(
        horizontal="center"
    )

    # Examination details
    sheet.cell(row=3, column=1, value="Academic Year")
    sheet.cell(row=3, column=2, value=f"Year {year}")

    sheet.cell(row=4, column=1, value="Semester")
    sheet.cell(row=4, column=2, value=semester)

    sheet.cell(row=5, column=1, value="Examination")
    sheet.cell(row=5, column=2, value=exam_type)

    sheet.cell(row=6, column=1, value="Section")
    sheet.cell(row=6, column=2, value=advisor.section)

    # Column headers
    header_row = 8

    headers = ["Register Number", "Student Name"]

    headers.extend([
        f"{subject.subject_code} - {subject.subject_name}"
        for subject in subjects
    ])

    for column, header in enumerate(headers, start=1):
        cell = sheet.cell(
            row=header_row,
            column=column,
            value=header
        )

        cell.font = Font(bold=True, color="FFFFFF")
        cell.fill = PatternFill(
            "solid",
            fgColor="4472C4"
        )
        cell.alignment = Alignment(
            horizontal="center",
            vertical="center",
            wrap_text=True
        )

    # Student records
    for row_index, student in enumerate(students, start=header_row + 1):

        sheet.cell(
            row=row_index,
            column=1,
            value=student.register_no
        )

        sheet.cell(
            row=row_index,
            column=2,
            value=(
                f"{student.first_name} {student.last_name or ''}"
            ).strip()
        )

        for column_index, subject in enumerate(subjects, start=3):

            value = marks_map.get(
                (student.student_id, subject.subject_id)
            )

            sheet.cell(
                row=row_index,
                column=column_index,
                value=float(value) if value is not None else None
            )

    # Formatting
    thin_border = Border(
        bottom=Side(style="thin", color="D9E2F3")
    )

    for row in sheet.iter_rows(
        min_row=header_row,
        max_row=header_row + len(students),
        min_col=1,
        max_col=total_columns
    ):
        for cell in row:
            cell.border = thin_border
            cell.alignment = Alignment(
                vertical="center",
                horizontal="center"
            )

    sheet.column_dimensions["A"].width = 20
    sheet.column_dimensions["B"].width = 28

    for column in range(3, total_columns + 1):
        sheet.column_dimensions[
            sheet.cell(row=header_row, column=column).column_letter
        ].width = 24

    sheet.freeze_panes = "C9"
    sheet.auto_filter.ref = (
        f"A{header_row}:{sheet.cell(row=header_row + len(students), column=total_columns).coordinate}"
    )

    # Send Excel file
    output = BytesIO()
    workbook.save(output)
    output.seek(0)

    filename = f"Class_Marks_Year{year}_Semester{semester}.xlsx"

    return send_file(
        output,
        as_attachment=True,
        download_name=filename,
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )


@app.route("/api/attendance")
def get_attendance():
    if "user_role" not in session:
        return jsonify({"error": "Please login first"}), 401

    student_id = session.get("user_id")

    if not student_id:
        return jsonify({"error": "Student not logged in"}), 400

    attendance_records = (
        Attendance.query
        .filter_by(student_id=student_id)
        .order_by(Attendance.attendance_date.desc())
        .all()
    )

    overall_records = [
        record for record in attendance_records
        if record.subject_id is None
    ]

    subject_records = [
        record for record in attendance_records
        if record.subject_id is not None
    ]

    def calculate_summary(records):
        total = len(records)
        present = sum(
            1 for record in records
            if record.status == "Present"
        )

        return {
            "present": present,
            "total": total,
            "percentage": round(
                (present / total) * 100, 2
            ) if total else 0
        }

    subjects = {}

    for record in subject_records:
        subject = Subject.query.get(record.subject_id)

        if not subject:
            continue

        subject_id = record.subject_id

        if subject_id not in subjects:
            subjects[subject_id] = {
                "subject_name": subject.subject_name,
                "subject_code": subject.subject_code,
                "present": 0,
                "total": 0,
                "percentage": 0
            }

        subjects[subject_id]["total"] += 1

        if record.status == "Present":
            subjects[subject_id]["present"] += 1

    for subject in subjects.values():
        subject["percentage"] = round(
            subject["present"] / subject["total"] * 100, 2
        ) if subject["total"] else 0

    records = []

    for record in attendance_records:
        subject = (
            Subject.query.get(record.subject_id)
            if record.subject_id is not None
            else None
        )

        records.append({
            "subject_name": (
                subject.subject_name
                if subject
                else "Overall Class Attendance"
            ),
            "subject_code": (
                subject.subject_code
                if subject
                else "-"
            ),
            "date": (
                record.attendance_date.isoformat()
                if record.attendance_date
                else None
            ),
            "status": record.status
        })

    return jsonify({
        "overall": calculate_summary(subject_records),
        "subjects": list(subjects.values()),
        "records": records
    }), 200


@app.route("/api/student/marks", methods=["GET"])
def get_student_marks():
    if session.get("user_role") != "student":
        return jsonify({"error": "Student login required"}), 403

    student_id = session.get("user_id")

    if not student_id:
        return jsonify({"error": "Student session not found"}), 401

    marks_records = (
        Marks.query
        .filter_by(
            student_id=student_id,
            is_published=True
        )
        .order_by(Marks.created_at.desc())
        .all()
    )

    marks_data = []

    for mark in marks_records:
        subject = mark.subject

        marks_data.append({
            "mark_id": mark.mark_id,
            "subject_name": (
                subject.subject_name if subject else "Unknown Subject"
            ),
            "subject_code": (
                subject.subject_code if subject else ""
            ),
            "exam_type": mark.exam_type or "",
            "marks_obtained": float(mark.marks_obtained or 0),
            "maximum_marks": float(mark.maximum_marks or 0),
            "percentage": round(
                float(mark.marks_obtained or 0)
                / float(mark.maximum_marks) * 100,
                2
            ) if mark.maximum_marks and float(mark.maximum_marks) > 0 else 0,
            "created_at": (
                mark.created_at.strftime("%d %b %Y")
                if mark.created_at else ""
            )
        })

    return jsonify(marks_data), 200


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


from datetime import date, datetime

@app.route("/api/leave-applications", methods=["POST"])
def submit_leave_application():
    if session.get("user_role") != "student":
        return jsonify({"error": "Student login required"}), 403

    student_id = session.get("user_id")

    if not student_id:
        return jsonify({"error": "Student session not found"}), 401

    application_type = request.form.get("application_type", "Leave").strip()
    from_date = request.form.get("from_date", "").strip()
    to_date = request.form.get("to_date", "").strip()
    reason = request.form.get("reason", "").strip()
    file = request.files.get("document")

    if application_type not in {"Leave", "OD", "Other"}:
        return jsonify({"error": "Invalid application type."}), 400

    if not from_date or not to_date or not reason:
        return jsonify({"error": "Please complete all required fields."}), 400

    try:
        start_date = date.fromisoformat(from_date)
        end_date = date.fromisoformat(to_date)
    except ValueError:
        return jsonify({"error": "Please enter valid dates."}), 400

    if end_date < start_date:
        return jsonify({
            "error": "The end date cannot be before the start date."
        }), 400

    if len(reason) > 5000:
        return jsonify({"error": "Reason is too long."}), 400

    stored_filename = None

    if file and file.filename:
        allowed_extensions = {"pdf", "jpg", "jpeg", "png"}
        original_filename = secure_filename(file.filename)

        if (
            not original_filename
            or "." not in original_filename
            or original_filename.rsplit(".", 1)[-1].lower()
            not in allowed_extensions
        ):
            return jsonify({
                "error": "Upload a PDF, JPG, JPEG or PNG file."
            }), 400

        extension = original_filename.rsplit(".", 1)[-1].lower()
        stored_filename = f"{uuid.uuid4().hex}.{extension}"

        upload_folder = os.path.join(
            app.instance_path, "leave_documents"
        )
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, stored_filename)

        try:
            file.save(file_path)
        except Exception:
            app.logger.exception("Leave document upload failed")
            return jsonify({"error": "Unable to upload the document."}), 500
    else:
        file_path = None

    try:
        application = LeaveApplication(
            student_id=student_id,
            from_date=start_date,
            to_date=end_date,
            reason=reason,
            document=stored_filename,
            status="Pending",
            applied_at=datetime.now()
        )

        # The model's application_type field must exist in your database.
        application.application_type = application_type

        db.session.add(application)
        db.session.commit()

        return jsonify({
            "message": "Leave application submitted successfully.",
            "leave_id": application.leave_id,
            "status": application.status
        }), 201

    except Exception:
        db.session.rollback()

        if file_path and os.path.exists(file_path):
            os.remove(file_path)

        app.logger.exception("Leave application submission failed")
        return jsonify({
            "error": "Submission failed. Please try again."
        }), 500



@app.route("/api/faculty/leave-applications", methods=["GET"])
def get_faculty_leave_applications():
    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")
    staff = db.session.get(Staff, staff_id)

    if not staff:
        return jsonify({"error": "Faculty account not found"}), 404

    # Get or create this faculty member's visit record
    visit = LeaveApprovalVisit.query.filter_by(
        staff_id=staff_id
    ).first()

    now = datetime.now()

    if visit:
        previous_visit = visit.last_visited_at
    else:
        previous_visit = None
        visit = LeaveApprovalVisit(
            staff_id=staff_id,
            last_visited_at=now
        )
        db.session.add(visit)

    # Get leave applications from the faculty member's department
    applications = (
        LeaveApplication.query
        .join(Student, LeaveApplication.student_id == Student.student_id)
        .filter(Student.department_id == staff.department_id)
        .order_by(LeaveApplication.applied_at.desc())
        .all()
    )

    # Count applications submitted since the previous visit
    new_since_last_visit = sum(
        1 for item in applications
        if previous_visit is not None
        and item.applied_at is not None
        and item.applied_at > previous_visit
    )

    # Record this visit after calculating the count
    visit.last_visited_at = now
    db.session.commit()

    return jsonify({
        "new_since_last_visit": new_since_last_visit,
        "last_visited_at": (
            previous_visit.strftime("%d %b %Y, %I:%M %p")
            if previous_visit else None
        ),
        "applications": [
            {
                "leave_id": item.leave_id,
                "student_name": (
                    f"{item.student.first_name} {item.student.last_name or ''}".strip()
                    if item.student else "Unknown Student"
                ),
                "register_no": (
                    item.student.register_no if item.student else ""
                ),
                "application_type": item.application_type or "Leave",
                "from_date": (
                    item.from_date.isoformat() if item.from_date else ""
                ),
                "to_date": (
                    item.to_date.isoformat() if item.to_date else ""
                ),
                "reason": item.reason or "",
                "document": item.document or "",
                "status": item.status or "Pending",
                "applied_at": (
                    item.applied_at.strftime("%d %b %Y, %I:%M %p")
                    if item.applied_at else ""
                )
            }
            for item in applications
        ]
    }), 200



@app.route(
    "/api/faculty/leave-applications/<int:leave_id>",
    methods=["PATCH"]
)
def update_faculty_leave_application(leave_id):
    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")
    staff = db.session.get(Staff, staff_id)

    if not staff:
        return jsonify({"error": "Faculty account not found"}), 404

    data = request.get_json(silent=True) or {}
    new_status = data.get("status")

    if new_status not in {"Approved", "Rejected"}:
        return jsonify({
            "error": "Status must be Approved or Rejected."
        }), 400

    application = (
        LeaveApplication.query
        .join(Student, LeaveApplication.student_id == Student.student_id)
        .filter(
            LeaveApplication.leave_id == leave_id,
            Student.department_id == staff.department_id
        )
        .first()
    )

    if not application:
        return jsonify({
            "error": "Application not found in your department."
        }), 404

    if application.status != "Pending":
        return jsonify({
            "error": "This application has already been processed."
        }), 409

    try:
        application.status = new_status
        application.approved_by = staff.staff_id

        db.session.commit()

        return jsonify({
            "message": f"Application {new_status.lower()} successfully.",
            "leave_id": application.leave_id,
            "status": application.status
        }), 200

    except Exception:
        db.session.rollback()
        app.logger.exception("Failed to update leave application")

        return jsonify({
            "error": "Unable to update application. Please try again."
        }), 500


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
@app.route("/api/faculty/documents", methods=["GET"])
def get_faculty_documents():
    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")

    advisor = ClassAdvisor.query.filter_by(
        staff_id=staff_id
    ).first()

    if advisor is None:
        return jsonify({
            "error": "You are not assigned as a class advisor."
        }), 403

    documents = (
        db.session.query(Document, Student)
        .join(
            Student,
            Document.student_id == Student.student_id
        )
        .filter(
            Student.department_id == advisor.department_id,
            Student.year == advisor.academic_year,
            Student.section == advisor.section
        )
        .order_by(Document.uploaded_at.desc())
        .all()
    )

    return jsonify([
        {
            "document_id": doc.document_id,
            "student_id": doc.student_id,
            "register_no": student.register_no,
            "student_name": (
                f"{student.first_name} {student.last_name or ''}"
            ).strip(),
            "document_name": doc.document_name,
            "document_type": doc.document_type,
            "original_filename": doc.original_filename,
            "status": doc.status,
            "uploaded_at": (
                doc.uploaded_at.strftime("%d %b %Y, %I:%M %p")
                if doc.uploaded_at else ""
            )
        }
        for doc, student in documents
    ]), 200


@app.route(
    "/api/faculty/documents/<int:document_id>/download",
    methods=["GET"]
)
def download_faculty_document(document_id):
    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")

    advisor = ClassAdvisor.query.filter_by(
        staff_id=staff_id
    ).first()

    if advisor is None:
        return jsonify({
            "error": "You are not assigned as a class advisor."
        }), 403

    document = (
        Document.query
        .join(Student, Document.student_id == Student.student_id)
        .filter(
            Document.document_id == document_id,
            Student.department_id == advisor.department_id,
            Student.year == advisor.academic_year,
            Student.section == advisor.section
        )
        .first()
    )

    if document is None:
        return jsonify({
            "error": "Document not found or access denied."
        }), 404

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

@app.route(
    "/api/faculty/documents/<int:document_id>/view",
    methods=["GET"]
)
def view_faculty_document(document_id):
    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")

    advisor = ClassAdvisor.query.filter_by(
        staff_id=staff_id
    ).first()

    if advisor is None:
        return jsonify({
            "error": "You are not assigned as a class advisor."
        }), 403

    document = (
        Document.query
        .join(Student, Document.student_id == Student.student_id)
        .filter(
            Document.document_id == document_id,
            Student.department_id == advisor.department_id,
            Student.year == advisor.academic_year,
            Student.section == advisor.section
        )
        .first()
    )

    if document is None:
        return jsonify({
            "error": "Document not found or access denied."
        }), 404

    upload_folder = os.path.join(
        app.instance_path,
        "student_documents"
    )

    return send_from_directory(
        upload_folder,
        document.stored_filename,
        as_attachment=False,
        download_name=document.original_filename
    )

@app.route(
    "/api/faculty/documents/<int:document_id>/review",
    methods=["POST"]
)
def review_faculty_document(document_id):
    if session.get("user_role") != "faculty":
        return jsonify({"error": "Faculty login required"}), 403

    staff_id = session.get("user_id")

    advisor = ClassAdvisor.query.filter_by(
        staff_id=staff_id
    ).first()

    if advisor is None:
        return jsonify({
            "error": "You are not assigned as a class advisor."
        }), 403

    data = request.get_json(silent=True) or {}
    new_status = data.get("status")

    if new_status not in {"Accepted", "Rejected"}:
        return jsonify({
            "error": "Status must be Accepted or Rejected."
        }), 400

    document = (
        db.session.query(Document)
        .join(Student, Document.student_id == Student.student_id)
        .filter(
            Document.document_id == document_id,
            Student.department_id == advisor.department_id,
            Student.year == advisor.academic_year,
            Student.section == advisor.section
        )
        .first()
    )

    if document is None:
        return jsonify({
            "error": "Document not found or access denied."
        }), 404

    if document.status != "Pending":
        return jsonify({
            "error": "This document has already been reviewed."
        }), 409

    try:
        document.status = new_status
        db.session.commit()

        return jsonify({
            "message": f"Document {new_status.lower()} successfully.",
            "document_id": document.document_id,
            "status": document.status
        }), 200

    except Exception:
        db.session.rollback()
        app.logger.exception("Document review failed")
        return jsonify({
            "error": "Unable to update document status."
        }), 500

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


@app.route(
    "/api/assignment-submissions/<int:submission_id>/view",
    methods=["GET"]
)
def view_assignment_submission(submission_id):
    role = session.get("user_role")
    user_id = session.get("user_id")

    if role not in ["student", "faculty"]:
        return jsonify({"error": "Login required"}), 403

    submission = Submission.query.filter_by(
        submission_id=submission_id
    ).first()

    if submission is None:
        return jsonify({"error": "Submission not found"}), 404

    if role == "student":
        if submission.student_id != user_id:
            return jsonify({"error": "Access denied"}), 403

    elif role == "faculty":
        assignment = (
            Assignment.query
            .filter_by(assignment_id=submission.assignment_id)
            .join(Subject)
            .filter(Subject.staff_id == user_id)
            .first()
        )

        if assignment is None:
            return jsonify({"error": "Access denied"}), 403

    upload_folder = os.path.join(
        app.instance_path,
        "assignment_submissions"
    )

    return send_from_directory(
        upload_folder,
        submission.stored_filename,
        as_attachment=False,
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
        "title": item.title,
        "subject_name": item.subject.subject_name,
        "due_date": (
            item.due_date.strftime("%d %b %Y")
            if item.due_date else ""
        ),
        "file_url": item.file_url
    }
    for item in assignments
]), 200


@app.route("/api/student-voice", methods=["POST"])
def submit_student_voice():
    if session.get("user_role") != "student":
        return jsonify({"error": "Student login required"}), 403

    student_id = session.get("user_id")

    if not student_id:
        return jsonify({"error": "Student session not found"}), 401

    data = request.get_json(silent=True) or {}

    voice_type = data.get("voice_type", "").strip()
    category = data.get("category", "").strip()
    title = data.get("title", "").strip()
    description = data.get("description", "").strip()
    target_audience = data.get("target_audience", "").strip()
    is_anonymous = data.get("is_anonymous", False)

    if voice_type not in ("Feedback", "Complaint"):
        return jsonify({"error": "Invalid submission type."}), 400

    if not all([category, title, description, target_audience]):
        return jsonify({"error": "Please complete all required fields."}), 400

    if target_audience not in ("Faculty", "Class Advisor", "Administration"):
        return jsonify({"error": "Invalid target audience."}), 400

    if not isinstance(is_anonymous, bool):
        return jsonify({"error": "Invalid anonymous setting."}), 400

    student = Student.query.get(student_id)

    if student is None:
        return jsonify({"error": "Student not found."}), 404

    try:
        submission = StudentVoice(
            student_id=student_id,
            voice_type=voice_type,
            category=category,
            title=title,
            description=description,
            target_audience=target_audience,
            is_anonymous=is_anonymous
        )

        db.session.add(submission)
        db.session.commit()

        return jsonify({
            "message": f"{voice_type} submitted successfully.",
            "voice_id": submission.voice_id
        }), 201

    except Exception:
        db.session.rollback()
        app.logger.exception("Student Voice submission failed")
        return jsonify({
            "error": "Submission failed. Please try again."
        }), 500

@app.route(
    "/api/faculty/student-voice",
    methods=["GET"]
)
def get_faculty_student_voice():

    # Only faculty can access this endpoint
    if session.get("user_role") != "faculty":
        return jsonify({
            "error": "Faculty login required"
        }), 403

    staff_id = session.get("user_id")

    staff = Staff.query.filter_by(
        staff_id=staff_id
    ).first()

    if staff is None:
        return jsonify({
            "error": "Faculty account not found"
        }), 404

    # Get class advisor assignment, if available
    advisor = ClassAdvisor.query.filter_by(
        staff_id=staff_id
    ).first()

    query = (
        StudentVoice.query
        .join(
            Student,
            StudentVoice.student_id == Student.student_id
        )
    )

    # Faculty-targeted submissions:
    # visible to staff in the same department
    faculty_filter = (
        (StudentVoice.target_audience == "Faculty")
        & (Student.department_id == staff.department_id)
    )

    # Class Advisor-targeted submissions:
    # visible only to the assigned class advisor
    if advisor:

        advisor_filter = (
            (StudentVoice.target_audience == "Class Advisor")
            & (Student.department_id == advisor.department_id)
            & (Student.year == advisor.academic_year)
            & (Student.section == advisor.section)
        )

        query = query.filter(
            faculty_filter | advisor_filter
        )

    else:

        query = query.filter(
            faculty_filter
        )

    voices = (
        query
        .order_by(StudentVoice.created_at.desc())
        .all()
    )

    voices_data = []

    for voice in voices:

        # Protect anonymous student identity
        student_name = "Anonymous Student"
        register_no = None

        if not voice.is_anonymous:
            student = voice.student

            if student:
                student_name = (
                    f"{student.first_name} "
                    f"{student.last_name or ''}"
                ).strip()

                register_no = student.register_no

        voices_data.append({
            "voice_id": voice.voice_id,
            "voice_type": voice.voice_type,
            "category": voice.category,
            "title": voice.title,
            "description": voice.description,
            "target_audience": voice.target_audience,
            "is_anonymous": voice.is_anonymous,
            "status": voice.status,
            "student_name": student_name,
            "register_no": register_no,

            "created_at": (
                voice.created_at.strftime(
                    "%d %b %Y, %I:%M %p"
                )
                if voice.created_at
                else ""
            )
        })

    return jsonify(voices_data), 200

@app.route("/api/student-voice", methods=["GET"])
def get_student_voice_submissions():
    if session.get("user_role") != "student":
        return jsonify({"error": "Student login required"}), 403

    student_id = session.get("user_id")

    if not student_id:
        return jsonify({"error": "Student session not found"}), 401

    submissions = (
        StudentVoice.query
        .filter_by(student_id=student_id)
        .order_by(StudentVoice.created_at.desc())
        .all()
    )

    return jsonify([
        {
            "voice_id": item.voice_id,
            "voice_type": item.voice_type,
            "category": item.category,
            "title": item.title,
            "description": item.description,
            "target_audience": item.target_audience,
            "is_anonymous": item.is_anonymous,
            "status": item.status,
            "created_at": (
                item.created_at.strftime("%d %b %Y, %I:%M %p")
                if item.created_at else ""
            )
        }
        for item in submissions
    ]), 200

@app.route(
    "/api/faculty/student-voice/<int:voice_id>/status",
    methods=["PUT"]
)
def update_student_voice_status(voice_id):

    if session.get("user_role") != "faculty":
        return jsonify({
            "error": "Faculty login required"
        }), 403

    staff_id = session.get("user_id")

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Status is required"
        }), 400

    new_status = data.get(
        "status",
        ""
    ).strip()

    allowed_statuses = [
        "Pending",
        "In Progress",
        "Resolved"
    ]

    if new_status not in allowed_statuses:
        return jsonify({
            "error": "Invalid status"
        }), 400

    # Get the staff member
    staff = Staff.query.filter_by(
        staff_id=staff_id
    ).first()

    if not staff:
        return jsonify({
            "error": "Faculty account not found"
        }), 404

    # Find the requested submission
    voice = (
        StudentVoice.query
        .join(
            Student,
            StudentVoice.student_id == Student.student_id
        )
        .filter(
            StudentVoice.voice_id == voice_id
        )
        .first()
    )

    if not voice:
        return jsonify({
            "error": "Student Voice submission not found"
        }), 404

    # Verify that this staff member has permission
    is_authorized = False

    # Faculty submissions from the same department
    if (
        voice.target_audience == "Faculty"
        and voice.student.department_id
        == staff.department_id
    ):
        is_authorized = True

    # Check Class Advisor submissions
    advisor = ClassAdvisor.query.filter_by(
        staff_id=staff_id
    ).first()

    if (
        advisor
        and voice.target_audience == "Class Advisor"
        and voice.student.department_id
        == advisor.department_id
        and voice.student.year
        == advisor.academic_year
        and voice.student.section
        == advisor.section
    ):
        is_authorized = True

    if not is_authorized:
        return jsonify({
            "error": "You are not authorized to update this submission"
        }), 403

    # Update status
    voice.status = new_status

    if new_status == "Resolved":
        voice.resolved_at = datetime.now()
    else:
        voice.resolved_at = None

    try:

        db.session.commit()

        return jsonify({
            "message": "Status updated successfully",
            "status": voice.status
        }), 200

    except Exception:

        db.session.rollback()

        app.logger.exception(
            "Student Voice status update failed"
        )

        return jsonify({
            "error": "Unable to update status"
        }), 500

@app.route("/api/notices", methods=["POST"])
def create_notice():

    if session.get("user_role") != "faculty":
        return jsonify({
            "error": "Faculty login required"
        }), 403

    staff_id = session.get("user_id")
    staff = Staff.query.filter_by(
        staff_id=staff_id
    ).first()

    if staff is None:
        return jsonify({
            "error": "Faculty not found"
        }), 404

    title = request.form.get("title", "").strip()
    description = request.form.get("description", "").strip()
    target_audience = request.form.get(
        "target_audience", ""
    ).strip()

    expiry_date = request.form.get(
        "expiry_date", ""
    ).strip()

    file = request.files.get("attachment")

    # Validate required fields
    if not title or not description or not target_audience:
        return jsonify({
            "error": "Title, description and target audience are required."
        }), 400

    # Validate audience
    valid_audiences = {
    "Students"
}

    if target_audience not in valid_audiences:
        return jsonify({
            "error": "Invalid target audience."
        }), 400

    # Validate expiry date
    parsed_expiry_date = None

    if expiry_date:
        try:
            parsed_expiry_date = date.fromisoformat(
                expiry_date
            )
        except ValueError:
            return jsonify({
                "error": "Invalid expiry date."
            }), 400

    # Handle attachment
    stored_filename = None
    file_path = None

    if file and file.filename:

        allowed_extensions = {
            "pdf", "doc", "docx",
            "jpg", "jpeg", "png"
        }

        original_filename = secure_filename(
            file.filename
        )

        if (
            not original_filename
            or "." not in original_filename
            or original_filename.rsplit(
                ".", 1
            )[-1].lower() not in allowed_extensions
        ):
            return jsonify({
                "error": (
                    "Upload a PDF, DOC, DOCX, JPG or PNG file."
                )
            }), 400

        extension = original_filename.rsplit(
            ".", 1
        )[-1].lower()

        stored_filename = (
            f"{uuid.uuid4().hex}.{extension}"
        )

        upload_folder = os.path.join(
            app.instance_path,
            "notice_attachments"
        )

        os.makedirs(upload_folder, exist_ok=True)

        file_path = os.path.join(
            upload_folder,
            stored_filename
        )

        try:
            file.save(file_path)

        except Exception:
            app.logger.exception(
                "Notice attachment upload failed"
            )

            return jsonify({
                "error": "Unable to upload attachment."
            }), 500

    # Save notice
    try:
        notice = Notice(
    title=title,
    description=description,
    posted_by=staff_id,
    department_id=staff.department_id,
    target_audience=target_audience,
    attachment=stored_filename,
    created_at=datetime.now(),
    expiry_date=parsed_expiry_date
)

        db.session.add(notice)
        db.session.commit()

        return jsonify({
            "message": "Notice created successfully.",
            "notice_id": notice.notice_id
        }), 201

    except Exception:
        db.session.rollback()

        # Remove uploaded file if database saving fails
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

        app.logger.exception(
            "Notice creation failed"
        )

        return jsonify({
            "error": "Failed to create notice."
        }), 500

@app.route("/api/notices", methods=["GET"])
def get_notices():

    if "user_role" not in session:
        return jsonify({
            "error": "Please login first"
        }), 401

    user_role = session.get("user_role")
    user_id = session.get("user_id")

    today = date.today()

    # STUDENT: See active notices from their department
    if user_role == "student":

        user = Student.query.filter_by(
            student_id=user_id
        ).first()

        if user is None:
            return jsonify({
                "error": "Student account not found"
            }), 404

        notices = (
            Notice.query
            .filter(
                Notice.department_id == user.department_id,
                Notice.target_audience == "Students",
                db.or_(
                    Notice.expiry_date.is_(None),
                    Notice.expiry_date >= today
                )
            )
            .order_by(Notice.created_at.desc())
            .all()
        )

    # FACULTY: See notices created by themselves
    elif user_role == "faculty":

        user = Staff.query.filter_by(
            staff_id=user_id
        ).first()

        if user is None:
            return jsonify({
                "error": "Faculty account not found"
            }), 404

        notices = (
            Notice.query
            .filter(
                Notice.posted_by == user.staff_id
            )
            .order_by(Notice.created_at.desc())
            .all()
        )

    else:
        return jsonify({
            "error": "Invalid user role"
        }), 403


    notices_data = []

    for notice in notices:

        notices_data.append({
            "notice_id": notice.notice_id,
            "title": notice.title,
            "description": notice.description,
            "target_audience": notice.target_audience,

            "posted_by": (
                notice.staff.staff_name
                if notice.staff
                else "Unknown"
            ),

            "attachment": notice.attachment,

            "created_at": (
                notice.created_at.strftime(
                    "%d %b %Y, %I:%M %p"
                )
                if notice.created_at
                else ""
            ),

            "expiry_date": (
                notice.expiry_date.strftime(
                    "%d %b %Y"
                )
                if notice.expiry_date
                else None
            )
        })

    return jsonify(notices_data), 200


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
