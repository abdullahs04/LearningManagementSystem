from functools import wraps
import mysql.connector
from flask import Blueprint, session, redirect, url_for, request, render_template
from database import DB_CONFIG

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

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        role, user = Auth.authenticate_user(username, password)
        if role:
            session['username'] = username
            session['role'] = role

            if role == 'student':
                session['rfid'] = user['RFID']
                return redirect(url_for('student.student_dashboard'))

            if role == 'campus_admin':
                session['campus_id'] = user['campusid']
                return redirect(url_for('campus_admin_dashboard'))

            return redirect(url_for('index') if role == 'admin' else url_for(f'{role}_dashboard'))

        return 'Invalid credentials', 401

    return render_template('login.html')

@auth_bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('auth.login'))
