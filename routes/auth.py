from flask import Blueprint, render_template, request, redirect, url_for, session
from werkzeug.security import check_password_hash

from models import Student, Staff, Admin, Department


auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["GET", "POST"])
def login():

    departments = Department.query.all()

    if request.method == "POST":

        email = request.form.get("email")
        password = request.form.get("password")
        department_id = request.form.get("department_id")

        # -------------------------
        # Check Student
        # -------------------------
        student = Student.query.filter_by(email=email).first()

        if student and check_password_hash(
            student.password_hash,
            password
        ):

            # If student already has a department,
            # verify the selected department matches it.
            if student.department_id is not None:
                if str(student.department_id) != department_id:
                    return render_template(
                        "login.html",
                        departments=departments,
                        error="Incorrect department for this account."
                    )

            session["user_id"] = student.student_id
            session["user_role"] = "student"
            session["department_id"] = student.department_id
            session["user_name"] = student.first_name

            return redirect(url_for("dashboard"))

        # -------------------------
        # Check Staff
        # -------------------------
        staff = Staff.query.filter_by(email=email).first()

        if staff and check_password_hash(
            staff.password_hash,
            password
        ):

            if staff.department_id is not None:
                if str(staff.department_id) != department_id:
                    return render_template(
                        "login.html",
                        departments=departments,
                        error="Incorrect department for this account."
                    )

            session["user_id"] = staff.staff_id
            session["user_role"] = "faculty"
            session["department_id"] = staff.department_id
            session["user_name"] = staff.staff_name

            return redirect(url_for("dashboard"))

        # -------------------------
        # Check Admin
        # -------------------------
        admin = Admin.query.filter_by(email=email).first()

        if admin and check_password_hash(
            admin.password_hash,
            password
        ):

            session["user_id"] = admin.admin_id
            session["user_role"] = "admin"
            session["user_name"] = admin.admin_name

            # Admin doesn't need a department
            session["department_id"] = None

            return redirect(url_for("dashboard"))

        # -------------------------
        # Invalid login
        # -------------------------
        return render_template(
            "login.html",
            departments=departments,
            error="Invalid email or password"
        )

    return render_template(
        "login.html",
        departments=departments
    )