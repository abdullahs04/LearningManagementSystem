from flask import Blueprint, session, redirect, url_for, render_template
import mysql.connector
from database import DB_CONFIG
from datetime import datetime
from auth import Auth

auth = Auth()

student_bp = Blueprint('student', __name__)

@student_bp.route('/dashboard')
@auth.login_required('student')
def student_dashboard():
    if 'rfid' not in session:
        return redirect(url_for('auth.login'))

    rfid = session['rfid']
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    # Fetch student data
    cursor.execute("""
        SELECT student_name, picture_url, DaysAttended, TotalDays 
        FROM Students 
        WHERE RFID = %s
    """, (rfid,))
    student_data = cursor.fetchone()

    if not student_data:
        cursor.close()
        conn.close()
        return redirect(url_for('auth.login'))

    student_name = student_data['student_name']
    image_url = student_data['picture_url']
    days_attended = student_data['DaysAttended']
    total_days = student_data['TotalDays']

    # Fetch subject attendance and exam availability
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

    now = datetime.now()
    subject_attendance = []
    processed_subjects = set()

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

    # Calculate general attendance percentage
    general_attendance_percentage = (days_attended / total_days) * 100 if total_days > 0 else 0

    # Fetch assessment types and their scores
    cursor.execute("""
        SELECT DISTINCT a.assessment_type
        FROM Assessments a
        JOIN assessments_marks am ON a.assessment_id = am.assessment_id
        WHERE am.rfid = %s
    """, (rfid,))
    assessment_types = cursor.fetchall()

    # Ensure all possible assessment types are displayed
    all_assessment_types = ['Monthly', 'Class', 'Mid', 'Final', 'Send Up', 'Mocks', 'Finals', 'Others', 'Test Session']
    assessment_types_dict = {type_['assessment_type'] for type_ in assessment_types}

    assessment_types_to_display = [
        type_ for type_ in all_assessment_types if type_ in assessment_types_dict
    ]

    cursor.close()
    conn.close()

    return render_template(
        'student_dashboard.html',
        student_name=student_name,
        image_url=image_url,
        subject_attendance=subject_attendance,
        general_attendance_percentage=general_attendance_percentage,
        assessment_types=assessment_types_to_display
    )


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
