from extensions import db
from datetime import datetime


class Document(db.Model):
    __tablename__ = "documents"

    document_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(
        db.Integer,
        db.ForeignKey("student.student_id"),
        nullable=False
    )
    document_name = db.Column(db.String(150), nullable=False)
    document_type = db.Column(db.String(50), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    stored_filename = db.Column(db.String(255), nullable=False, unique=True)
    status = db.Column(
        db.String(20),
        nullable=False,
        default="Pending"
    )
    uploaded_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )