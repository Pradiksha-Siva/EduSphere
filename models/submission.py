
from extensions import db
from datetime import datetime


class Submission(db.Model):
    __tablename__ = "submission"

    submission_id = db.Column(
        db.Integer,
        primary_key=True
    )

    assignment_id = db.Column(
        db.Integer,
        db.ForeignKey("assignment.assignment_id"),
        nullable=False
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("student.student_id"),
        nullable=False
    )

    original_filename = db.Column(
        db.String(255),
        nullable=False
    )

    stored_filename = db.Column(
        db.String(255),
        nullable=False,
        unique=True
    )

    submitted_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    status = db.Column(
        db.String(20),
        default="Submitted",
        nullable=False
    )
    assignment = db.relationship("Assignment")
    student = db.relationship("Student")