import mysql.connector
from src.database import DB_CONFIG
from src.auth import Auth
from flask import Blueprint, request, render_template,  jsonify
from werkzeug.utils import secure_filename
import os

from flask import current_app
import mysql.connector




auth = Auth()

admin_bp = Blueprint('admin', __name__)


def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

#to manage student fine campus wise
@admin_bp.route('/api/list_and_update_fine/<int:campus_id>', methods=['GET'])
@auth.login_required('admin')
def list_and_update_fine(campus_id):
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

    return {"students": students, "campus_id": campus_id}


@admin_bp.route('/api/update_student_fines/<int:campus_id>', methods=['POST'])
@auth.login_required('admin')
def update_student_fines(campus_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        for key, value in request.json.items():
            if key.startswith('fine_'):
                student_id = key.split('_')[1]
                try:
                    fine_adjustment = int(value)
                except ValueError:
                    return {"error": f"Invalid fine adjustment for student {student_id}"}, 400

                update_query = '''
                    UPDATE Students SET Fine = Fine + %s WHERE rfid = %s AND campusid = %s
                '''
                cursor.execute(update_query, (fine_adjustment, student_id, campus_id))

        conn.commit()
        return {"message": "Fines updated successfully!"}, 200
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()


#To manage student fees campus wise
@admin_bp.route('/api/list_and_update_fees/<int:campus_id>', methods=['GET'])
@auth.login_required('admin')
def list_and_update_fees(campus_id):
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

    return {"students": students, "campus_id": campus_id}


@admin_bp.route('/api/update_student_fees/<int:campus_id>', methods=['POST'])
@auth.login_required('admin')
def update_student_fees(campus_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        for key, value in request.json.items():
            if key.startswith('fees_'):
                student_id = key.split('_')[1]
                try:
                    new_fees = int(value)
                except ValueError:
                    return {"error": f"Invalid fee amount for student {student_id}"}, 400

                update_query = '''
                    UPDATE Students SET FeeAmount = %s WHERE rfid = %s AND campusid = %s
                '''
                cursor.execute(update_query, (new_fees, student_id, campus_id))

        conn.commit()
        return {"message": "Fees updated successfully!"}, 200
    except Exception as e:
        conn.rollback()
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

#To view attendance of students campus wise
@admin_bp.route('/api/attendance_students/<int:campus_id>', methods=['GET'])
@auth.login_required('admin')
def attendance_students(campus_id):
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

    return {
        "students": students,
        "total_present": total_present,
        "total_absent": total_absent,
        "total_no_status": total_no_status
    }


#To view attendance of employees check in checkout campus wise
@admin_bp.route('/api/campus/<int:campus_id>/attendance_employees', methods=['GET'])
@auth.login_required('admin')
def attendance_employees(campus_id):
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

    return jsonify({
        'employees': employees,
        'total_present': total_present,
        'total_absent': total_absent,
        'total_no_status': total_no_status
    })


# ✅ Student Registration API
@admin_bp.route('/api/register_students', methods=['POST'])
@auth.login_required('admin')
def register_student():
    data = request.form
    picture = request.files.get('picture')

    if not all([data.get('rfid'), data.get('student_name'), data.get('password'), data.get('student_id'),
                data.get('absentee_id'), data.get('year'), data.get('campus_id')]):
        return jsonify({'error': 'Missing required fields'}), 400

    relative_path = None

    if picture and picture.filename:
        filename = secure_filename(picture.filename)
        picture_path = os.path.join('uploads', filename)  # Adjust folder
        picture.save(picture_path)
        relative_path = f"/uploads/{filename}"

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            INSERT INTO Students (RFID, student_name, picture_url, Password, StudentID, AbsenteeID, year, campusid)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
        data['rfid'], data['student_name'], relative_path, data['password'], data['student_id'], data['absentee_id'],
        data['year'], data['campus_id']))
        conn.commit()
        return jsonify({'message': 'Student registered successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()


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

# @admin_bp.route('/register_students', methods=['GET'])
# @auth.login_required('admin')
# def register_students():
#     return render_template('register_student.html')

