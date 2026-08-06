from flask import Flask
from config import Config
from extensions import db
from models import Department

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

@app.route("/")
def home():
    departments = Department.query.all()

    if departments:
        return "<br>".join([d.department_name for d in departments])

    return "No departments found."

if __name__ == "__main__":
    app.run(debug=True)