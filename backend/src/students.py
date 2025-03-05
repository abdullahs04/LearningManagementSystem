from flask import Blueprint, session, render_template, request,jsonify
import mysql.connector
from src.database import DB_CONFIG
from datetime import datetime
import os
from src.auth import Auth
from werkzeug.utils import secure_filename

auth = Auth()
student_bp = Blueprint('student', __name__)


#Student Dashboard
@student_bp.route('/api/dashboard', methods=['GET'])
@auth.login_required('student')
def student_dashboard():
    if 'rfid' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    rfid = session['rfid']
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT student_name, picture_url, DaysAttended, TotalDays 
        FROM Students 
        WHERE RFID = %s
    """, (rfid,))
    student_data = cursor.fetchone()

    if not student_data:
        cursor.close()
        conn.close()
        return jsonify({"error": "Student not found"}), 404

    general_attendance_percentage = (
        (student_data['DaysAttended'] / student_data['TotalDays']) * 100
        if student_data['TotalDays'] > 0 else 0
    )

    cursor.execute("""
        SELECT 
            s.subject_name, 
            (se.SubjectAttended / se.TotalDays) * 100 AS attendance_percentage, 
            se.subject_id,
            e.exam_id,
            e.Exam_PDF,
            e.Start_Time,
            e.End_Time
        FROM Subjects_Enrolled se
        JOIN Subjects s ON se.subject_id = s.subject_id
        LEFT JOIN Exams e ON se.subject_id = e.Subject_id
        WHERE se.RFID = %s
    """, (rfid,))
    subject_attendance_data = cursor.fetchall()

    subject_attendance = []
    processed_subjects = set()

    now = datetime.now()
    for row in subject_attendance_data:
        subject_id = row['subject_id']
        if subject_id not in processed_subjects:
            subject_attendance.append({
                'subject_name': row['subject_name'],
                'attendance_percentage': row['attendance_percentage'],
                'exam_id': None,
                'exam_pdf': None,
                'subject_id': subject_id
            })
            processed_subjects.add(subject_id)

        if row['End_Time'] and row['End_Time'] > now:
            subject_attendance.append({
                'subject_name': row['subject_name'],
                'attendance_percentage': row['attendance_percentage'],
                'exam_id': row['exam_id'],
                'exam_pdf': row['Exam_PDF'],
                'subject_id': subject_id
            })

    cursor.execute("""
        SELECT DISTINCT a.assessment_type
        FROM Assessments a
        JOIN assessments_marks am ON a.assessment_id = am.assessment_id
        WHERE am.rfid = %s
    """, (rfid,))
    assessment_types = [row['assessment_type'] for row in cursor.fetchall()]

    cursor.close()
    conn.close()

    return jsonify({
        "student_name": student_data['student_name'],
        "image_url": student_data['picture_url'],
        "subject_attendance": subject_attendance,
        "general_attendance_percentage": general_attendance_percentage,
        "assessment_types": assessment_types
    })

@student_bp.route('/api/view_students/<int:campus_id>', methods=['GET'])
@auth.login_required('admin')
def view_students(campus_id):
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    query = '''
        SELECT Student_Name AS student_name, rfid AS username, Year
        FROM Students
        WHERE CampusID = %s 
        ORDER BY Student_Name, Year
    '''
    cursor.execute(query, (campus_id,))
    students = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(students)

@student_bp.route('/api/upload_picture', methods=['POST'])
@auth.login_required('student')
def upload_picture():
    if 'picture' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    picture = request.files['picture']
    rfid = request.form['rfid']

    if picture:
        filename = secure_filename(picture.filename)
        upload_folder = 'static/images'
        picture_path = os.path.join(upload_folder, filename)
        picture.save(picture_path)

        relative_path = f"/{upload_folder}/{filename}"

        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        try:
            cursor.execute("UPDATE Students SET picture_url = %s WHERE rfid = %s", (relative_path, rfid))
            conn.commit()
            return jsonify({'message': 'Picture uploaded successfully', 'picture_url': relative_path}), 200
        except Exception as e:
            conn.rollback()
            return jsonify({'error': str(e)}), 500
        finally:
            cursor.close()
            conn.close()



# Temporarily to make it active as other routes called in it are not ready yet
@student_bp.route('/syllabus_and_schedules')
@auth.login_required('student')
def syllabus_and_schedules():
    return render_template('syllabus_and_schedules.html')

@student_bp.route('/assessment_details/<assessment_type>')
@auth.login_required('student')
def assessment_details(assessment_type):
    return render_template('assessment_details.html', assessment_type=assessment_type)

@student_bp.route('/subject_attendance')
@auth.login_required('student')
def subject_attendance():
    return render_template('subject_attendance.html')

@student_bp.route('/exam_submission/<exam_id>')
@auth.login_required('student')
def exam_submission(exam_id):
    return render_template('exam_submission.html', exam_id=exam_id)

@student_bp.route('/general_attendance')
@auth.login_required('student')
def general_attendance():
    return render_template('general_attendance.html')
