from extensions import db


class Attendance(db.Model):
    __tablename__ = "attendance"

    attendance_id = db.Column(
        db.Integer,
        primary_key=True
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("student.student_id")
    )

    subject_id = db.Column(
        db.Integer,
        db.ForeignKey("subject.subject_id")
    )

    attendance_date = db.Column(
        db.Date
    )

    status = db.Column(
        db.Enum("Present", "Absent", "Leave", "OD")
    )

    marked_by = db.Column(
        db.Integer,
        db.ForeignKey("staff.staff_id")
    )

    student = db.relationship(
        "Student",
        back_populates="attendance_records"
    )

    subject = db.relationship(
        "Subject",
        back_populates="attendance_records"
    )

    staff = db.relationship(
        "Staff",
        back_populates="attendance_records"
    )