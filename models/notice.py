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

    # Targeting fields
    department_id = db.Column(
        db.Integer,
        db.ForeignKey("department.department_id"),
        nullable=True
    )

    academic_year = db.Column(
        db.Integer,
        nullable=True
    )

    semester = db.Column(
        db.Integer,
        nullable=True
    )

    section = db.Column(
        db.String(10),
        nullable=True
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