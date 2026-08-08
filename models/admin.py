from extensions import db


class Admin(db.Model):
    __tablename__ = "admin"

    admin_id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )

    admin_name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(100),
        unique=True
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    phone = db.Column(
        db.String(15)
    )

    role = db.Column(
        db.String(30),
        default="Admin"
    )

    created_at = db.Column(
        db.DateTime
    )

    last_login = db.Column(
        db.DateTime
    )