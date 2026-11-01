from werkzeug.security import generate_password_hash
from app import app
from extensions import db
from models import Staff

with app.app_context():
    staff = Staff.query.get(4)

    if staff is None:
        print("Staff ID 4 not found.")
    else:
        staff.password_hash = generate_password_hash("StaffTest@2026")
        db.session.commit()

        print("Password reset successfully.")
        print("Staff ID:", staff.staff_id)
        print("Login email:", staff.email)
        print("Temporary password: StaffTest@2026")