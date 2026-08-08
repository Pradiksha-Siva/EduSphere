from extensions import db


class Department(db.Model):
    __tablename__ = "department"

    department_id = db.Column(
        db.Integer,
        primary_key=True
    )

    department_name = db.Column(
        db.String(100),
        nullable=False
    )

    department_code = db.Column(
        db.String(20),
        unique=True,
        nullable=False
    )

    hod_staff_id = db.Column(
        db.Integer
    )

    created_at = db.Column(
        db.DateTime
    )

    staff_members = db.relationship(
        "Staff",
        back_populates="department"
    )

    students = db.relationship(
    "Student",
    back_populates="department"
    )

    subjects = db.relationship(
    "Subject",
    back_populates="department"
    )