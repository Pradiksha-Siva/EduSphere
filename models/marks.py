from extensions import db


class Marks(db.Model):
    __tablename__ = "marks"

    mark_id = db.Column(
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

    exam_type = db.Column(
        db.String(50)
    )

    marks_obtained = db.Column(
        db.Numeric(5, 2)
    )
    is_published = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )

    maximum_marks = db.Column(
        db.Numeric(5, 2)
    )

    staff_id = db.Column(
        db.Integer,
        db.ForeignKey("staff.staff_id")
    )

    created_at = db.Column(
        db.DateTime
    )

    student = db.relationship(
        "Student",
        back_populates="marks_records"
    )

    subject = db.relationship(
        "Subject",
        back_populates="marks_records"
    )

    staff = db.relationship(
        "Staff",
        back_populates="marks_records"
    )