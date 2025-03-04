import mysql.connector
from database import DB_CONFIG
from auth import Auth
from flask import Blueprint, request, render_template, flash, redirect, url_for, session
from werkzeug.utils import secure_filename
import os
from datetime import datetime
import mysql.connector
from app import app
app.config['UPLOAD_FOLDER'] = 'static/uploads'


auth = Auth()

admin_bp = Blueprint('admin', __name__)


def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

#to manage student fine campus wise
@admin_bp.route('/list_and_update_fine/<int:campus_id>')
@auth.login_required('admin')
def list_and_update_fine(campus_id):
    if not campus_id:
        return 'Unauthorized', 403

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = '''
        SELECT s.rfid, s.Student_Name, s.Fine
        FROM Students s
        WHERE s.campusid = %s
        ORDER BY s.Student_Name
    '''
    cursor.execute(query, (campus_id,))
    students = cursor.fetchall()

    cursor.close()
    conn.close()

    return render_template('update_fine.html', students=students, campus_id=campus_id)

@admin_bp.route('/update_student_fines/<int:campus_id>', methods=['POST'])
@auth.login_required('admin')
def update_student_fines(campus_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    for key, value in request.form.items():
        if key.startswith('fine_'):
            student_id = key.split('_')[1]
            try:
                fine_adjustment = int(value)
            except ValueError:
                flash(f"Invalid fine adjustment for student {student_id}")
                continue

            update_query = '''
                UPDATE Students SET Fine = Fine + %s WHERE rfid = %s AND campusid = %s
            '''
            cursor.execute(update_query, (fine_adjustment, student_id, campus_id))

    conn.commit()
    cursor.close()
    conn.close()

    flash('Fines updated successfully!')
    return redirect(url_for('campus.list_and_update_fine', campus_id=campus_id))


#To manage student fees campus wise
@admin_bp.route('/list_and_update_fees/<int:campus_id>')
@auth.login_required('admin')
def list_and_update_fees(campus_id):
    if not campus_id:
        return 'Unauthorized', 403
 
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = '''
        SELECT s.rfid, s.Student_Name, s.FeeAmount
        FROM Students s
        WHERE s.campusid = %s
        ORDER BY s.Student_Name
    '''
    cursor.execute(query, (campus_id,))
    students = cursor.fetchall()

    cursor.close()
    conn.close()

    return render_template('students_fees.html', students=students, campus_id=campus_id)

@admin_bp.route('/update_student_fees/<int:campus_id>', methods=['POST'])
@auth.login_required('admin')
def update_student_fees(campus_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    for key, value in request.form.items():
        if key.startswith('fees_'):
            student_id = key.split('_')[1]
            try:
                new_fees = int(value)
            except ValueError:
                flash(f"Invalid fee amount for student {student_id}")
                continue

            update_query = '''
                UPDATE Students SET FeeAmount = %s WHERE rfid = %s AND campusid = %s
            '''
            cursor.execute(update_query, (new_fees, student_id, campus_id))

    conn.commit()
    cursor.close()
    conn.close()

    flash('Fees updated successfully!')
    return redirect(url_for('campus.list_and_update_fees', campus_id=campus_id))

#To view attendance of students campus wise
@admin_bp.route('/attendance_students/<int:campus_id>')
@auth.login_required('admin')
def attendance_students(campus_id):
    if not campus_id:
        return 'Unauthorized', 403

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = '''
        SELECT s.rfid, s.Student_Name, ga.Status
        FROM Students s
        LEFT JOIN General_Attendance ga ON s.RFID = ga.RFID AND ga.date = CURDATE()
        WHERE s.campusid = %s
    '''
    cursor.execute(query, (campus_id,))
    students = cursor.fetchall()

    total_present = sum(1 for student in students if student['Status'] == 'Present')
    total_absent = sum(1 for student in students if student['Status'] == 'Absent')
    total_no_status = sum(1 for student in students if not student['Status'])

    cursor.close()
    conn.close()

    return render_template(
        'attendance_students.html',
        students=students,
        total_present=total_present,
        total_absent=total_absent,
        total_no_status=total_no_status
    )


#To view attendance of employees check in checkout campus wise
@admin_bp.route('/campus/<int:campus_id>/attendance_employees')
@auth.login_required('admin')
def attendance_employees(campus_id):
    if not campus_id:
        return 'Unauthorized', 403

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = '''
        SELECT 
            e.RFID,
            e.Employee_Name,
            COALESCE(ea.employee_check_in, 'No status') AS employee_check_in,
            COALESCE(ea.employee_check_out, 'No status') AS employee_check_out,
            COALESCE(ea.Late_status, 'No status') AS Late_status,
            CASE 
                WHEN ea.employee_check_in IS NOT NULL THEN 'Present'
                WHEN ea.RFID IS NULL THEN 'Absent'
                ELSE 'No status'
            END AS Attendance_status
        FROM 
            employee e
        LEFT JOIN 
            Employee_Attendance ea ON e.RFID = ea.RFID AND ea.Attendance_date = CURDATE()
        WHERE e.campusid = %s
        ORDER BY 
            e.Employee_Name ASC
    '''
    cursor.execute(query, (campus_id,))
    employees = cursor.fetchall()

    total_present = sum(1 for emp in employees if emp.get('Attendance_status') == 'Present')
    total_absent = sum(1 for emp in employees if emp.get('Attendance_status') == 'Absent')
    total_no_status = sum(1 for emp in employees if emp.get('Attendance_status') == 'No status')

    cursor.close()
    conn.close()

    return render_template(
        'attendance_employees.html',
        employees=employees,
        total_present=total_present,
        total_absent=total_absent,
        total_no_status=total_no_status
    )
#To Register New Students
@admin_bp.route('/register_students', methods=['GET'])
@auth.login_required('admin')
def register_student():
    if request.method == 'POST':
        rfid = request.form['rfid']
        student_name = request.form['student_name']
        picture = request.files['picture']
        password = request.form['password']
        student_id = request.form['student_id']
        absentee_id = request.form['absentee_id']
        year = request.form['year']
        campus_id = request.form['campus_id']

        picture_path = None

        if picture:
            filename = secure_filename(picture.filename)
            picture_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            picture.save(picture_path)
            relative_path = f"/{app.config['UPLOAD_FOLDER']}/{filename}"

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        try:
            cursor.execute("""
                INSERT INTO Students (RFID, student_name, picture_url, Password, StudentID, AbsenteeID, year, campusid)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (rfid, student_name, relative_path, password, student_id, absentee_id, year, campus_id))
            conn.commit()
            flash('Student registered successfully!', 'success')
            return redirect(url_for('register_student'))
        except Exception as e:
            conn.rollback()
            flash('Error registering student: ' + str(e), 'danger')
        finally:
            cursor.close()
            conn.close()

    return render_template('register_student.html')


# it needs to be corrected after link with attendance.py

# @auth.login_required('admin')
# def absentees_list():
#     if request.method == 'POST':
#         action = request.form.get('action')
#         date_str = request.form.get('date')
#
#         if date_str:
#             try:
#                 date_time = datetime.strptime(date_str, '%Y-%m-%d')
#             except ValueError as e:
#                 date_time = datetime.now()
#         else:
#             date_time = datetime.now()
#
#         if action == 'mark_absent':
#             self.rfid_handler.mark_absent_general_attendance(date_time.strftime('%Y-%m-%d %H:%M:%S'))
#     else:
#         date_time = datetime.now()
#
#     absentees = self.db.fetch_data("""
#         SELECT s.student_name, s.RFID, s.AbsenteeID
#         FROM Students s
#         JOIN General_Attendance ga ON s.RFID = ga.RFID
#         WHERE DATE(ga.date) = %s AND ga.status = 'Absent'
#         ORDER BY s.AbsenteeID;
#     """, (date_time.date(),))
#
#     absentees = [
#         {"student_name": row[0], "RFID": row[1], "AbsenteeID": row[2]}
#         for row in absentees
#     ]
#
#     return render_template('absentees_list.html', absentees=absentees,
#                            selected_date=date_time.date().strftime('%Y-%m-%d'))

@admin_bp.route('/register_students', methods=['GET'])
@auth.login_required('admin')
def register_students():
    return render_template('register_student.html')
