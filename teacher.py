# teacher.py

from flask import Blueprint, request, render_template, redirect, url_for, flash, session
from datetime import datetime
from database import Database
from auth import Auth

auth = Auth()
teacher_bp = Blueprint('teacher', __name__)
db = Database()


# Teacher dashboard
@teacher_bp.route('/dashboard')
@auth.login_required('teacher')
def teacher_dashboard():
    # Fetch data for the dashboard
    attendance_records = db.fetch_data("""
        SELECT ga.RFID, s.student_name, ga.date, ga.status
        FROM General_Attendance ga
        JOIN Students s ON ga.RFID = s.RFID
        ORDER BY ga.date DESC
        LIMIT 5
    """)

    students = db.fetch_data("SELECT * FROM Students ORDER BY student_name LIMIT 5")

    assessments = db.fetch_data("SELECT * FROM Assessments ORDER BY created_at DESC LIMIT 5")

    return render_template('teacher_dashboard.html',
                           attendance_records=attendance_records,
                           students=students,
                           assessments=assessments)


# View and manage student attendance
@teacher_bp.route('/attendance', methods=['GET', 'POST'])
@auth.login_required('teacher')
def manage_attendance():
    if request.method == 'POST':
        rfid = request.form['rfid']
        date = request.form['date']
        status = request.form['status']
        db.execute_query("""
            INSERT INTO General_Attendance (RFID, date, status)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE status = VALUES(status)
        """, (rfid, date, status))
        flash('Attendance updated successfully!', 'success')

    attendance_records = db.fetch_data("""
        SELECT ga.RFID, s.student_name, ga.date, ga.status
        FROM General_Attendance ga
        JOIN Students s ON ga.RFID = s.RFID
        ORDER BY ga.date DESC
    """)

    return render_template('manage_attendance.html', attendance_records=attendance_records)


# View and manage student details
@teacher_bp.route('/students', methods=['GET', 'POST'])
@auth.login_required('teacher')
def manage_students():
    if request.method == 'POST':
        rfid = request.form['rfid']
        student_name = request.form['student_name']
        db.execute_query("""
            INSERT INTO Students (RFID, student_name)
            VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE student_name = VALUES(student_name)
        """, (rfid, student_name))
        flash('Student details updated successfully!', 'success')

    students = db.fetch_data("SELECT * FROM Students ORDER BY student_name")

    return render_template('manage_students.html', students=students)


# Create, view, and manage assessments
@teacher_bp.route('/assessments', methods=['GET', 'POST'])
@auth.login_required('teacher')
def manage_assessments():
    if request.method == 'POST':
        subject_id = request.form['subject_id']
        assessment_type = request.form['assessment_type']
        total_marks = request.form['total_marks']
        created_at = datetime.now()
        db.execute_query("""
            INSERT INTO Assessments (subject_id, assessment_type, total_marks, created_at)
            VALUES (%s, %s, %s, %s)
        """, (subject_id, assessment_type, total_marks, created_at))
        flash('Assessment created successfully!', 'success')

    assessments = db.fetch_data("SELECT * FROM Assessments ORDER BY created_at DESC")

    return render_template('manage_assessments.html', assessments=assessments)


# View and manage assessment marks
@teacher_bp.route('/assessment_marks/<int:assessment_id>', methods=['GET', 'POST'])
@auth.login_required('teacher')
def manage_assessment_marks(assessment_id):
    if request.method == 'POST':
        rfid = request.form['rfid']
        marks_achieved = request.form['marks_achieved']
        db.execute_query("""
            INSERT INTO assessments_marks (rfid, assessment_id, marks_achieved)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE marks_achieved = VALUES(marks_achieved)
        """, (rfid, assessment_id, marks_achieved))
        flash('Marks updated successfully!', 'success')

    marks = db.fetch_data("""
        SELECT am.rfid, s.student_name, am.marks_achieved
        FROM assessments_marks am
        JOIN Students s ON am.rfid = s.RFID
        WHERE am.assessment_id = %s
        ORDER BY s.student_name
    """, (assessment_id,))

    return render_template('manage_assessment_marks.html', marks=marks, assessment_id=assessment_id)