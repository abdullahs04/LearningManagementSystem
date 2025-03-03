from flask import Blueprint, session, redirect, url_for, render_template, flash
import mysql.connector
from database import DB_CONFIG
from auth import Auth

auth = Auth()

subject_bp = Blueprint('subject', __name__)


@subject_bp.route('/student_subjects_enrollment/<int:campus_id>')
@auth.login_required('admin')
def student_subjects_enrollment(campus_id):
    if not campus_id:
        return 'Unauthorized', 403

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

    return render_template(
        'Student_Subjects_Enrollment.html',
        students=students,
        total_present=total_present,
        total_absent=total_absent,
        total_no_status=total_no_status
    )


@subject_bp.route('/student_subjects/<int:rfid>')
@auth.login_required('admin')
def student_subjects(rfid):
    if not rfid:
        return 'Unauthorized', 403

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

    return render_template(
        'student_subjects2.html',
        rfid=rfid,
        enrolled_subjects=enrolled_subjects,
        available_subjects=available_subjects
    )


@subject_bp.route('/enroll_subject/<int:rfid>/<int:subject_id>', methods=['POST'])
@auth.login_required('admin')
def enroll_subject(rfid, subject_id):
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()

    enroll_query = 'INSERT INTO Subjects_Enrolled (RFID, Subject_id) VALUES (%s, %s)'
    cursor.execute(enroll_query, (rfid, subject_id))
    conn.commit()

    cursor.close()
    conn.close()

    flash("Student enrolled in subject successfully.")
    return redirect(url_for('admin.student_subjects', rfid=rfid))


@subject_bp.route('/unenroll_subject/<int:rfid>/<int:subject_id>', methods=['POST'])
@auth.login_required('admin')
def unenroll_subject(rfid, subject_id):
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()

    unenroll_query = 'DELETE FROM Subjects_Enrolled WHERE RFID = %s AND Subject_id = %s'
    cursor.execute(unenroll_query, (rfid, subject_id))
    conn.commit()

    cursor.close()
    conn.close()

    flash("Student unenrolled from subject successfully.")
    return redirect(url_for('admin.student_subjects', rfid=rfid))


@subject_bp.route('/campus_subjects/<int:campus_id>')
@auth.login_required('admin')
def campus_subjects(campus_id):
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    query = '''
        SELECT 
            s.subject_id, 
            s.subject_name, 
            t.TeacherId, 
            COUNT(se.RFID) AS TotalStudents
        FROM Subjects s
        LEFT JOIN Teachers t ON s.subject_id = t.subject_id AND s.CampusID = t.campusid
        LEFT JOIN Subjects_Enrolled se ON s.subject_id = se.subject_id
        WHERE s.CampusID = %s
        GROUP BY s.subject_id, s.subject_name, t.TeacherId
        ORDER BY s.subject_name
    '''
    cursor.execute(query, (campus_id,))
    subjects = cursor.fetchall()

    cursor.close()
    conn.close()

    return render_template('campus_subjects.html', subjects=subjects, campus_id=campus_id)