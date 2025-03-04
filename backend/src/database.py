import mysql.connector

DB_CONFIG = {
    'host': '193.203.162.232',
    'user': 'rfid',
    'password': 'TRY/One12',
    'database': 'rfid',
    'port': 3306,
    'charset': 'utf8mb4',
    'ssl_disabled': True,
}

class Database:
    def __init__(self, config=DB_CONFIG):
        self.config = config

    def connect(self):
        return mysql.connector.connect(**self.config)

    def fetch_data(self, query, params=None):
        try:
            conn = self.connect()
            cursor = conn.cursor(dictionary=True)
            cursor.execute(query, params)
            data = cursor.fetchall()
            cursor.close()
            conn.close()
            return data
        except mysql.connector.Error as e:
            print("MySQL Error:", e)
            return []

    def execute_query(self, query, params=None):
        try:
            conn = self.connect()
            cursor = conn.cursor()
            cursor.execute(query, params)
            conn.commit()
            cursor.close()
            conn.close()
        except mysql.connector.Error as e:
            print("MySQL Error:", e)
