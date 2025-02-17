import motor.motor_asyncio
import os


class DataBase:
    def __init__(self):
        _uri = os.environ.get('DB_URI')
        self._client = motor.motor_asyncio.AsyncIOMotorClient(_uri)
        self.db = self._client['FinalYearProject']
        self.userDB = self.db['userDB']
        self.certDB = self.db['certDB']
        self.feedDB = self.db['feedDB']

