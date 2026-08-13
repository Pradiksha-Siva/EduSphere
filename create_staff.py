from werkzeug.security import generate_password_hash

password = "Staff@123"

print(generate_password_hash(password))