from extensions import db


class Notice(db.Model):
    __tablename__ = "notice"

    notice_id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(200)
    )

    description = db.Column(
        db.Text
    )

    posted_by = db.Column(
        db.Integer,
        db.ForeignKey("staff.staff_id")
    )

    target_audience = db.Column(
        db.Enum("Students", "Staff", "All")
    )

    attachment = db.Column(
        db.String(255)
    )

    created_at = db.Column(
        db.DateTime
    )

    expiry_date = db.Column(
        db.Date
    )

    staff = db.relationship(
        "Staff",
        back_populates="notices"
    )