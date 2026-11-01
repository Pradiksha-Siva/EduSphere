
from extensions import db
from datetime import datetime


class LeaveApprovalVisit(db.Model):
    __tablename__ = "leave_approval_visit"

    visit_id = db.Column(
        db.Integer,
        primary_key=True
    )

    staff_id = db.Column(
        db.Integer,
        db.ForeignKey("staff.staff_id"),
        unique=True,
        nullable=False
    )

    last_visited_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    staff = db.relationship("Staff")
