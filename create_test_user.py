from werkzeug.security import generate_password_hash

from app import app
from extensions import db
from models import Student


with app.app_context():

    student = Student(
        register_no="TEST001",
        first_name="Test",
        last_name="Student",
        email="student@test.com",
        phone="9876543210",
        year=2,
        semester=4,
        section="A",
        password_hash=generate_password_hash("student123")
    )

    db.session.add(student)
    db.session.commit()

    print("Test student created successfully")