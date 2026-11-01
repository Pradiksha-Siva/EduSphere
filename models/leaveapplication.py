from extensions import db


class LeaveApplication(db.Model):
    __tablename__ = "leaveapplication"

    leave_id = db.Column(
        db.Integer,
        primary_key=True
    )
    application_type = db.Column(
    db.Enum("Leave", "OD", "Other", name="leave_application_type"),
    nullable=False,
    default="Leave"
)

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("student.student_id")
    )

    from_date = db.Column(
        db.Date
    )

    to_date = db.Column(
        db.Date
    )

    reason = db.Column(
        db.Text
    )

    document = db.Column(
        db.String(255)
    )

    status = db.Column(
        db.Enum("Pending", "Approved", "Rejected"),
        default="Pending"
    )

    approved_by = db.Column(
        db.Integer,
        db.ForeignKey("staff.staff_id")
    )

    applied_at = db.Column(
        db.DateTime
    )

    student = db.relationship(
        "Student",
        back_populates="leave_applications"
    )

    staff = db.relationship(
        "Staff",
        back_populates="approved_leaves"
    )