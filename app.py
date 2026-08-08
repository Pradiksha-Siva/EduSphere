from flask import Flask
from config import Config
from extensions import db
from models import (
    Department,
    Staff,
    Student,
    Admin,
    Subject,
    Attendance,
    Marks,
    Assignment,
    Notes,
    Notice,
    Complaint,
    LeaveApplication
)

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)


@app.route("/")
def home():
    departments = Department.query.all()

    output = ""

    for dept in departments:
        output += f"{dept.department_name}<br>"

    return output


if __name__ == "__main__":
    app.run(debug=True)