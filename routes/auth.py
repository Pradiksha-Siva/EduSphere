from flask import Blueprint, render_template, request, redirect, url_for, session
from werkzeug.security import check_password_hash

from models import Student, Staff, Admin


auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form.get("email")
        password = request.form.get("password")


        # ================= STUDENT LOGIN =================

        student = Student.query.filter_by(email=email).first()

        if student and check_password_hash(
            student.password_hash,
            password
        ):

            session["user_id"] = student.student_id
            session["user_role"] = "student"
            session["department_id"] = student.department_id
            session["user_name"] = student.first_name

            return redirect(url_for("dashboard"))


        # ================= STAFF LOGIN =================

        staff = Staff.query.filter_by(email=email).first()

        if staff and check_password_hash(
            staff.password_hash,
            password
        ):

            session["user_id"] = staff.staff_id
            session["user_role"] = "faculty"
            session["department_id"] = staff.department_id
            session["user_name"] = staff.staff_name

            return redirect(url_for("dashboard"))


        # ================= ADMIN LOGIN =================

        admin = Admin.query.filter_by(email=email).first()

        if admin and check_password_hash(
            admin.password_hash,
            password
        ):

            session["user_id"] = admin.admin_id
            session["user_role"] = "admin"
            session["user_name"] = admin.admin_name
            session["department_id"] = None

            return redirect(url_for("dashboard"))


        # ================= INVALID LOGIN =================

        return render_template(
            "login.html",
            error="Invalid email or password"
        )


    return render_template("login.html")


# ================= LOGOUT =================

@auth.route("/logout")
def logout():

    session.clear()

    return redirect(url_for("auth.login"))