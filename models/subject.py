from extensions import db


class Subject(db.Model):
    __tablename__ = "subject"

    subject_id = db.Column(
        db.Integer,
        primary_key=True
    )

    subject_code = db.Column(
        db.String(20),
        unique=True
    )

    subject_name = db.Column(
        db.String(100),
        nullable=False
    )

    semester = db.Column(
        db.Integer
    )

    credits = db.Column(
        db.Integer
    )

    department_id = db.Column(
        db.Integer,
        db.ForeignKey("department.department_id")
    )

    staff_id = db.Column(
        db.Integer,
        db.ForeignKey("staff.staff_id")
    )

    department = db.relationship(
        "Department",
        back_populates="subjects"
    )

    staff = db.relationship(
        "Staff",
        back_populates="subjects"
    )

    attendance_records = db.relationship(
    "Attendance",
    back_populates="subject"
    )

    marks_records = db.relationship(
    "Marks",
    back_populates="subject"
    )

    assignments = db.relationship(
    "Assignment",
    back_populates="subject"
    )