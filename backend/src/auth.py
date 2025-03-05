from functools import wraps
import mysql.connector
from flask import Blueprint, session, redirect, url_for, request,jsonify
from src.database import DB_CONFIG

auth_bp = Blueprint('auth', __name__)

class Auth:
    @staticmethod
    def login_required(role=None):
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                if 'username' not in session:
                    return redirect(url_for('auth.login'))
                if role and session.get('role') != role:
                    return redirect(url_for('auth.login'))
                return f(*args, **kwargs)
            return decorated_function
        return decorator

    @staticmethod
    def authenticate_user(username, password):
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        role_queries = {
            'admin': "SELECT * FROM Admin WHERE username = %s AND password = %s",
            'teacher': "SELECT * FROM Teachers WHERE teacherid = %s AND password = %s",
            'student': "SELECT RFID FROM Students WHERE RFID = %s AND password = %s",
            'campus_admin': "SELECT campusid FROM CampusAdmin WHERE username = %s AND password = %s"
        }

        for role, query in role_queries.items():
            cursor.execute(query, (username, password))
            user = cursor.fetchone()
            if user:
                cursor.close()
                conn.close()
                return role, user

        cursor.close()
        conn.close()
        return None, None

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    role, user = Auth.authenticate_user(username, password)
    if role:
        session['username'] = username
        session['role'] = role

        response = {'role': role}
        if role == 'student':
            session['rfid'] = user['RFID']
            response['rfid'] = user['RFID']

        elif role == 'campus_admin':
            session['campus_id'] = user['campusid']
            response['campus_id'] = user['campusid']

        return jsonify(response), 200

    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200