from extensions import db


class Notes(db.Model):
    __tablename__ = "notes"

    note_id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
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

    uploaded_at = db.Column(
        db.DateTime
    )