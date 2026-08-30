import os
from urllib.parse import quote_plus

class Config:

    SECRET_KEY = "edusphere_secret_key"

    password = quote_plus(os.getenv("DB_PASSWORD", ""))

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{os.getenv('DB_USER')}:{password}"
        f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT', '3306')}"
        f"/{os.getenv('DB_NAME')}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False