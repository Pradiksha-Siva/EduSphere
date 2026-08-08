from extensions import db


class Assignment(db.Model):
    __tablename__ = "assignment"

    assignment_id = db.Column(
        db.Integer,
        primary_key=True
    )

    subject_id = db.Column(
        db.Integer,
        db.ForeignKey("subject.subject_id")
    )

    staff_id = db.Column(
        db.Integer,
        db.ForeignKey("staff.staff_id")
    )

    title = db.Column(
        db.String(200)
    )

    description = db.Column(
        db.Text
    )

    file_url = db.Column(
        db.String(255)
    )

    due_date = db.Column(
        db.Date
    )

    created_at = db.Column(
        db.DateTime
    )

    subject = db.relationship(
        "Subject",
        back_populates="assignments"
    )

    staff = db.relationship(
        "Staff",
        back_populates="assignments"
    )