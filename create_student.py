from werkzeug.security import generate_password_hash

password = "Student@123"

print(generate_password_hash(password))
