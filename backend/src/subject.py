from flask import Blueprint,request ,jsonify
import mysql.connector
from src.database import DB_CONFIG
from src.auth import Auth

auth = Auth()

subject_bp = Blueprint('subject', __name__)


@subject_bp.route('/api/student_subjects_enrollment/<int:campus_id>', methods=['GET'])
@auth.login_required('admin')
def student_subjects_enrollment(campus_id):
    if not campus_id:
        return jsonify({'error': 'Unauthorized'}), 403

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    query = '''
        SELECT s.rfid, s.Student_Name, ga.Status, s.year
        FROM Students s
        LEFT JOIN General_Attendance ga ON s.RFID = ga.RFID AND ga.date = CURDATE()
        WHERE s.campusid = %s
        ORDER BY s.year
    '''
    cursor.execute(query, (campus_id,))
    students = cursor.fetchall()

    total_present = sum(1 for student in students if student['Status'] == 'Present')
    total_absent = sum(1 for student in students if student['Status'] == 'Absent')
    total_no_status = sum(1 for student in students if not student['Status'])

    cursor.close()
    conn.close()

    return jsonify({
        'students': students,
        'total_present': total_present,
        'total_absent': total_absent,
        'total_no_status': total_no_status
    })

@subject_bp.route('/api/student_subjects/<int:rfid>', methods=['GET'])
@auth.login_required('admin')
def student_subjects(rfid):
    if not rfid:
        return jsonify({'error': 'Unauthorized'}), 403

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    enrolled_query = '''
        SELECT se.Subject_id, s.Subject_Name
        FROM Subjects_Enrolled se
        JOIN Subjects s ON se.Subject_id = s.Subject_id
        WHERE se.RFID = %s
    '''
    cursor.execute(enrolled_query, (rfid,))
    enrolled_subjects = cursor.fetchall()

    all_subjects_query = '''
        SELECT s.Subject_id, s.Subject_Name
        FROM Subjects s
        WHERE s.campusid = (SELECT campusid FROM Students WHERE RFID = %s)
          AND s.Subject_id NOT IN (SELECT Subject_id FROM Subjects_Enrolled WHERE RFID = %s)
    '''
    cursor.execute(all_subjects_query, (rfid, rfid))
    available_subjects = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({
        'rfid': rfid,
        'enrolled_subjects': enrolled_subjects,
        'available_subjects': available_subjects
    })


@subject_bp.route('/api/enroll_subject', methods=['POST'])
@auth.login_required('admin')
def nroll_subject():
    data = request.get_json()
    rfid = data.get('rfid')
    subject_id = data.get('subject_id')

    if not rfid or not subject_id:
        return jsonify({'error': 'Missing parameters'}), 400

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()

    try:
        cursor.execute('INSERT INTO Subjects_Enrolled (RFID, Subject_id) VALUES (%s, %s)', (rfid, subject_id))
        conn.commit()
        return jsonify({'message': 'Student enrolled successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@subject_bp.route('/api/unenroll_subject', methods=['POST'])
@auth.login_required('admin')
def unenroll_subject():
    data = request.get_json()
    rfid = data.get('rfid')
    subject_id = data.get('subject_id')

    if not rfid or not subject_id:
        return jsonify({'error': 'Missing parameters'}), 400

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()

    try:
        cursor.execute('DELETE FROM Subjects_Enrolled WHERE RFID = %s AND Subject_id = %s', (rfid, subject_id))
        conn.commit()
        return jsonify({'message': 'Student unenrolled successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@subject_bp.route('/api/campus_subjects/<int:campus_id>', methods=['GET'])
@auth.login_required('admin')
def campus_subjects(campus_id):
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    query = '''
        SELECT 
            s.subject_id, 
            s.subject_name, 
            COALESCE(t.TeacherId, 'N/A') AS TeacherId, 
            COUNT(DISTINCT se.RFID) AS TotalStudents
        FROM Subjects s
        LEFT JOIN Teachers t ON s.subject_id = t.subject_id AND s.CampusID = t.campusid
        LEFT JOIN Subjects_Enrolled se ON s.subject_id = se.subject_id
        WHERE s.CampusID = %s
        GROUP BY s.subject_id
        ORDER BY s.subject_name
    '''
    cursor.execute(query, (campus_id,))
    subjects = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({'campus_id': campus_id, 'subjects': subjects})