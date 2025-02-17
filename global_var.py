import os
from dotenv import load_dotenv
from database import DataBase

load_dotenv()


class Var:
    db = DataBase()
    SECRET_KEY = os.environ.get('SECRET_KEY')
