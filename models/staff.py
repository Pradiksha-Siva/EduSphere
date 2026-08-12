from extensions import db


class Staff(db.Model):
    __tablename__ = "staff"

    staff_id = db.Column(
        db.Integer,
        primary_key=True
    )

    staff_name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(100),
        unique=True
    )

    phone = db.Column(
        db.String(15)
    )

    designation = db.Column(
        db.String(50)
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
        back_populates="staff_members"
    )

    subjects = db.relationship(
    "Subject",
    back_populates="staff"
    )

    attendance_records = db.relationship(
    "Attendance",
    back_populates="staff"
    )

    marks_records = db.relationship(
    "Marks",
    back_populates="staff"
    )

    assignments = db.relationship(
    "Assignment",
    back_populates="staff"
    )

    notes = db.relationship(
    "Notes",
    back_populates="staff"
    )

    notices = db.relationship(
    "Notice",
    back_populates="staff"
    )

    assigned_complaints = db.relationship(
    "Complaint",
    back_populates="staff"
    )

    approved_leaves = db.relationship(
    "LeaveApplication",
    back_populates="staff"
    )