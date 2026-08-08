from extensions import db


class Complaint(db.Model):
    __tablename__ = "complaint"

    complaint_id = db.Column(
        db.Integer,
        primary_key=True
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("student.student_id")
    )

    category = db.Column(
        db.String(100)
    )

    title = db.Column(
        db.String(200)
    )

    description = db.Column(
        db.Text
    )

    status = db.Column(
        db.Enum("Pending", "In Progress", "Resolved"),
        default="Pending"
    )

    assigned_to = db.Column(
        db.Integer,
        db.ForeignKey("staff.staff_id")
    )

    created_at = db.Column(
        db.DateTime
    )

    resolved_at = db.Column(
        db.DateTime
    )

    student = db.relationship(
        "Student",
        back_populates="complaints"
    )

    staff = db.relationship(
        "Staff",
        back_populates="assigned_complaints"
    )