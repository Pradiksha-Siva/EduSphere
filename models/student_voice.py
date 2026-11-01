
from extensions import db
from datetime import datetime


class StudentVoice(db.Model):
    __tablename__ = "student_voice"

    voice_id = db.Column(
        db.Integer,
        primary_key=True
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("student.student_id"),
        nullable=False
    )

    voice_type = db.Column(
        db.Enum("Feedback", "Complaint", name="student_voice_type"),
        nullable=False
    )

    category = db.Column(
        db.String(100),
        nullable=False
    )

    title = db.Column(
        db.String(200),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    target_audience = db.Column(
        db.Enum(
            "Faculty",
            "Class Advisor",
            "Administration",
            name="student_voice_target"
        ),
        nullable=False
    )

    is_anonymous = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    status = db.Column(
        db.Enum(
            "Pending",
            "In Progress",
            "Resolved",
            name="student_voice_status"
        ),
        default="Pending",
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    resolved_at = db.Column(
        db.DateTime,
        nullable=True
    )

    student = db.relationship(
        "Student",
        backref="student_voice_submissions"
    )
