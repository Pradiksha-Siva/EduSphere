
from extensions import db


class Timetable(db.Model):
    __tablename__ = "timetable"

    timetable_id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )

    department_id = db.Column(
        db.Integer,
        db.ForeignKey("department.department_id"),
        nullable=False
    )

    academic_year = db.Column(db.Integer, nullable=False)
    semester = db.Column(db.Integer, nullable=False)
    section = db.Column(db.String(10), nullable=False)

    day_of_week = db.Column(
        db.Enum(
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ),
        nullable=False
    )

    period_number = db.Column(db.SmallInteger, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)

    subject_id = db.Column(
        db.Integer,
        db.ForeignKey("subject.subject_id"),
        nullable=False
    )

    staff_id = db.Column(
        db.Integer,
        db.ForeignKey("staff.staff_id"),
        nullable=True
    )

    room_number = db.Column(db.String(30), nullable=True)

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.current_timestamp()
    )

    subject = db.relationship("Subject")
    staff = db.relationship("Staff")
