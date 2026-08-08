from extensions import db


class Student(db.Model):
    __tablename__ = "student"

    student_id = db.Column(
        db.Integer,
        primary_key=True
    )

    register_no = db.Column(
        db.String(20),
        unique=True,
        nullable=False
    )

    first_name = db.Column(
        db.String(50),
        nullable=False
    )

    last_name = db.Column(
        db.String(50)
    )

    gender = db.Column(
        db.Enum("Male", "Female", "Other")
    )

    dob = db.Column(
        db.Date
    )

    email = db.Column(
        db.String(100),
        unique=True
    )

    phone = db.Column(
        db.String(15)
    )

    address = db.Column(
        db.Text
    )

    year = db.Column(
        db.Integer
    )

    semester = db.Column(
        db.Integer
    )

    section = db.Column(
        db.String(10)
    )

    department_id = db.Column(
        db.Integer,
        db.ForeignKey("department.department_id")
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    profile_photo = db.Column(
        db.String(255)
    )

    created_at = db.Column(
        db.DateTime
    )

    department = db.relationship(
        "Department",
        back_populates="students"
    )

    attendance_records = db.relationship(
    "Attendance",
    back_populates="student"
    )