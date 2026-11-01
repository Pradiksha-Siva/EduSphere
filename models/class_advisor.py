from extensions import db


class ClassAdvisor(db.Model):
    __tablename__ = "class_advisor"

    advisor_id = db.Column(
        db.Integer, primary_key=True, autoincrement=True
    )
    staff_id = db.Column(
        db.Integer,
        db.ForeignKey("staff.staff_id"),
        nullable=False
    )
    department_id = db.Column(
        db.Integer,
        db.ForeignKey("department.department_id"),
        nullable=False
    )
    academic_year = db.Column(db.Integer, nullable=False)
    section = db.Column(db.String(10), nullable=False)
    
    batch = db.Column(
        db.String(20),
        nullable=True
    )