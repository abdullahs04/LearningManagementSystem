from flask import Blueprint, session, request, redirect, url_for, render_template, flash
import mysql.connector
import json
from datetime import datetime
from database import DB_CONFIG
from auth import Auth

auth = Auth()
assessment_bp = Blueprint('assessment', __name__)

# Make Assessment Functions
@assessment_bp.route('/make_assessment', methods=['GET', 'POST'])
@auth.login_required('teacher')
def make_assessment():
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    try:
        teacherid = session['username']
        subjects = fetch_teacher_subjects(cursor, teacherid)
    except mysql.connector.Error as err:
        print(f"Database Error: {err}")
        flash('A database error occurred while fetching subjects.', 'error')
        subjects = []
    finally:
        cursor.close()
        conn.close()

    if request.method == 'POST':
        return handle_assessment_submission(teacherid, subjects)

    return render_template('make_assessment.html', subjects=subjects)


def fetch_teacher_subjects(cursor, teacherid):
    cursor.execute("SELECT subject_id, subject_name FROM Subjects WHERE teacherid = %s", (teacherid,))
    return cursor.fetchall()


def handle_assessment_submission(teacherid, subjects):
    assessment_type = request.form['assessment_type']
    total_marks = get_total_marks(request.form, assessment_type)
    grading_criteria = get_grading_criteria(request.form)
    subject_id = request.form['subject_id']
    created_at = parse_datetime(request.form['created_at'])

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    try:
        if assessment_exists(cursor, teacherid, subject_id, assessment_type, created_at):
            flash(f"An assessment of type '{assessment_type}' has already been created this month.", "error")
            return redirect(url_for('teacher.make_assessment'))

        sequence = get_next_sequence(cursor, subject_id, assessment_type)
        assessment_id = insert_assessment(cursor, teacherid, subject_id, assessment_type, total_marks, grading_criteria,
                                          sequence, created_at)

        if assessment_type == 'Monthly':
            insert_quizzes(cursor, assessment_id, subject_id)

        conn.commit()
        flash('Assessment created successfully!', 'success')
        return redirect(url_for('teacher.make_assessment'))

    except mysql.connector.Error as err:
        print(f"Database Error: {err}")
        conn.rollback()
        flash('A database error occurred while creating the assessment.', 'error')
    finally:
        cursor.close()
        conn.close()

    return render_template('make_assessment.html', subjects=subjects)


def get_total_marks(form, assessment_type):
    total_marks = form.get('total_marks')
    if not total_marks:
        return 15 if assessment_type == 'Quiz' else 35 if assessment_type == 'Monthly' else 0
    try:
        return int(total_marks)
    except ValueError:
        return 0


def get_grading_criteria(form):
    return {
        "A*": form.get('grade_A_star', 90),
        "A": form.get('grade_A', 80),
        "B": form.get('grade_B', 70),
        "C": form.get('grade_C', 60),
        "D": form.get('grade_D', 50),
        "E": form.get('grade_E', 40),
        "F": form.get('grade_F', 30)
    }


def parse_datetime(created_at):
    return datetime.strptime(created_at, '%Y-%m-%dT%H:%M')


def assessment_exists(cursor, teacherid, subject_id, assessment_type, created_at):
    cursor.execute("""
        SELECT COUNT(*) AS count 
        FROM Assessments 
        WHERE teacherid=%s AND subject_id=%s AND assessment_type=%s 
              AND MONTH(created_at)=%s AND YEAR(created_at)=%s
    """, (teacherid, subject_id, assessment_type, created_at.month, created_at.year))
    return cursor.fetchone()['count'] > 10


def get_next_sequence(cursor, subject_id, assessment_type):
    base_sequences = {'Monthly': 100, 'Send-Up': 150}
    base_sequence = base_sequences.get(assessment_type, 0)

    cursor.execute("""
        SELECT COALESCE(MAX(sequence), %s - 1) AS max_sequence
        FROM Assessments
        WHERE subject_id = %s AND assessment_type = %s
    """, (base_sequence, subject_id, assessment_type))
    return cursor.fetchone()['max_sequence'] + 1


def insert_assessment(cursor, teacherid, subject_id, assessment_type, total_marks, grading_criteria, sequence,
                      created_at):
    cursor.execute("""
        INSERT INTO Assessments (teacherid, subject_id, assessment_type, total_marks, grading_criteria, sequence, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (teacherid, subject_id, assessment_type, total_marks, json.dumps(grading_criteria), sequence, created_at))
    return cursor.lastrowid


def insert_quizzes(cursor, assessment_id, subject_id):
    for quiz_number in range(1, 4):
        cursor.execute("""
            INSERT INTO quizzes (monthly_assessment_id, quiz_number, created_at, subject_id)
            VALUES (%s, %s, NOW(), %s)
        """, (assessment_id, quiz_number, subject_id))
#Make Assessment Functions Ended

#View Submissions for a particular Subject
@assessment_bp.route('/view_submissions/<int:subject_id>')
@auth.login_required('teacher')
def view_submissions(subject_id):
    """Fetch and display student submissions for a given subject."""
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT st.student_name, es.solution_pdf 
        FROM Exam_Submissions es
        JOIN Students st ON es.rfid = st.rfid
        WHERE es.exam_id IN (
            SELECT exam_id FROM Exams WHERE subject_id = %s
        )
        ORDER BY st.student_name
    """, (subject_id,))
    submissions = cursor.fetchall()

    cursor.close()
    conn.close()

    return render_template('view_submissions.html', submissions=submissions, subject_id=subject_id)
#End Submissions

#View and Edit Quiz Marks For Teacher Dashboard
@assessment_bp.route('/view_quiz_marks/<int:quiz_id>')
@auth.login_required('teacher')
def view_quiz_marks(quiz_id):
    """Fetch and display quiz marks for a given quiz."""
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT q.quiz_id, s.subject_name, a.assessment_type, q.quiz_number, q.sequence
        FROM quizzes q
        JOIN Assessments a ON q.monthly_assessment_id = a.assessment_id
        JOIN Subjects s ON q.subject_id = s.subject_id
        WHERE q.quiz_id = %s
    """, (quiz_id,))
    quiz = cursor.fetchone()

    if not quiz:
        return "Quiz not found", 404

    cursor.execute("""
        SELECT qm.rfid, st.student_name, qm.marks_achieved
        FROM quiz_marks qm
        JOIN Students st ON qm.rfid = st.rfid
        WHERE qm.quiz_id = %s
        ORDER BY st.student_name 
    """, (quiz_id,))
    marks = cursor.fetchall()

    cursor.close()
    conn.close()

    return render_template('view_quiz_marks.html', quiz=quiz, marks=marks)

@assessment_bp.route('/update_marks', methods=['POST'])
@auth.login_required('teacher')
def update_marks():
    """Update quiz marks for a student."""
    quiz_id = request.form['quiz_id']
    rfid = request.form['rfid']
    new_marks = request.form['new_marks']

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            UPDATE quiz_marks 
            SET marks_achieved = %s 
            WHERE quiz_id = %s AND rfid = %s
        """, (new_marks, quiz_id, rfid))
        conn.commit()
        flash('Marks updated successfully!', 'success')
    except Exception as e:
        conn.rollback()
        flash(f'Error updating marks: {str(e)}', 'error')
    finally:
        cursor.close()
        conn.close()

    return redirect(url_for('assessment.view_quiz_marks', quiz_id=quiz_id))
#End

#View and Edit Other Assessment Details on Teacher Dashboard
@assessment_bp.route('/view_marks/<int:assessment_id>', methods=['GET'])
@auth.login_required('teacher')
def view_marks(assessment_id):
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    # Get the assessment detailss
    cursor.execute(""" 
        SELECT a.assessment_id, s.subject_name, a.assessment_type
        FROM Assessments a
        JOIN Subjects s ON a.subject_id = s.subject_id
        WHERE a.assessment_id = %s
    """, (assessment_id,))
    assessment = cursor.fetchone()

    if not assessment:
        return "Assessment not found", 404

    # Get the marks for the assessment
    cursor.execute(""" 
        SELECT sm.rfid, st.student_name, sm.Marks_Acheived
        FROM assessments_marks sm
        JOIN Students st ON sm.rfid = st.rfid
        WHERE sm.assessment_id = %s
        ORDER BY st.student_name
    """, (assessment_id,))
    marks = cursor.fetchall()

    cursor.close()
    conn.close()

    return render_template('view_marks.html', assessment=assessment, marks=marks)



@assessment_bp.route('/update_assessment_marks', methods=['POST'])
@auth.login_required('teacher')
def update_assessment_marks():
    assessment_id = request.form['assessment_id']
    rfid = request.form['rfid']
    new_marks = request.form['new_marks']

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)


    try:
        cursor.execute("""
                UPDATE assessments_marks SET Marks_Acheived = %s 
                WHERE assessment_id = %s AND rfid = %s
            """, (new_marks, assessment_id, rfid))
        conn.commit()
        flash('Marks updated successfully!', 'success')
    except Exception:
        conn.rollback()
        flash('An error occurred while updating marks.', 'error')
    finally:
        cursor.close()
        conn.close()

    return redirect(url_for('assessment.view_marks', assessment_id=assessment_id))
#End




#Subject Wise Assessment Details if monthly it also shows its 3 quizzes along with it
@assessment_bp.route('/view_assessment_details/<int:subject_id>')
@auth.login_required('admin')
def view_assessment_details(subject_id):
    """Fetch and display assessment details for a given subject."""
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)


    cursor.execute("""
        SELECT a.assessment_id, a.total_marks, am.Marks_Acheived, a.sequence, s.subject_name, a.created_at
        FROM Assessments a
        JOIN assessments_marks am ON a.assessment_id = am.assessment_id
        JOIN Subjects s ON a.subject_id = s.subject_id
        WHERE a.subject_id = %s
        ORDER BY a.created_at
    """, (subject_id,))
    assessments = cursor.fetchall()

    cursor.execute("""
        SELECT q.quiz_id, q.monthly_assessment_id, q.quiz_number, qm.marks_achieved, q.created_at
        FROM quizzes q
        JOIN quiz_marks qm ON q.quiz_id = qm.quiz_id
        WHERE q.subject_id = %s
        ORDER BY q.monthly_assessment_id, q.quiz_number
    """, (subject_id,))
    quizzes = cursor.fetchall()

    cursor.execute("""
        SELECT s.StudentID, s.student_name, am.assessment_id, am.Marks_Acheived, a.created_at
        FROM Students s
        JOIN assessments_marks am ON s.RFID = am.rfid
        JOIN Assessments a ON am.assessment_id = a.assessment_id
        WHERE a.subject_id = %s
        ORDER BY s.StudentID, a.created_at
    """, (subject_id,))
    student_records = cursor.fetchall()

    cursor.close()
    conn.close()

    processed_data = {}
    for record in student_records:
        student_id = record['StudentID']
        if student_id not in processed_data:
            processed_data[student_id] = {
                'student_name': record['student_name'],
                'assessments': {}
            }
        assessment_id = record['assessment_id']
        processed_data[student_id]['assessments'][assessment_id] = {
            'marks_achieved': record['Marks_Acheived'],
            'created_at': record['created_at'],
            'quizzes': {}
        }

    for quiz in quizzes:
        for student_id, data in processed_data.items():
            for assessment_id, record in data['assessments'].items():
                if quiz['monthly_assessment_id'] in data['assessments']:
                    record['quizzes'][f'Quiz{quiz["quiz_number"]}'] = quiz['marks_achieved']

    return render_template('view_assessment_details.html',
                           subject_id=subject_id,
                           processed_data=processed_data)
@assessment_bp.route('/unmarked_assessments')
@auth.login_required('teacher')
def unmarked_assessments():
    teacherid = session['username']

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)


    # Get campus ID of the teacher
    cursor.execute("""
        SELECT campusid FROM Teachers WHERE teacherid = %s
    """, (teacherid,))
    campusid = cursor.fetchone()['campusid']

    # Retrieve unmarked assessments within the teacher's campus
    cursor.execute("""
        SELECT a.assessment_id, s.subject_name, a.assessment_type, a.sequence
        FROM Assessments a
        JOIN Subjects s ON a.subject_id = s.subject_id
        WHERE a.teacherid = %s 
          AND s.campusid = %s
          AND a.assessment_id NOT IN (
              SELECT assessment_id FROM assessments_marks
          )
    """, (teacherid, campusid))

    assessments = cursor.fetchall()

    # Calculate the display sequence number
    for assessment in assessments:
        if assessment['assessment_type'] == 'Monthly':
            assessment['sequence_number'] = assessment['sequence'] - 99
        else:
            assessment['sequence_number'] = assessment['sequence']

    cursor.close()
    conn.close()

    return render_template('unmarked_assessment.html', assessments=assessments)

#List of Unmarked and Marked Assessment for Teacher dashboard
@assessment_bp.route('/marked_assessments')
@auth.login_required('teacher')
def marked_assessments():
    teacherid = session['username']
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT campusid FROM Teachers WHERE teacherid = %s
    """, (teacherid,))
    campusid = cursor.fetchone()['campusid']

    cursor.execute("""
        SELECT a.assessment_id, s.subject_name, a.assessment_type, a.sequence
        FROM Assessments a
        JOIN Subjects s ON a.subject_id = s.subject_id
        WHERE a.teacherid = %s 
          AND s.campusid = %s
          AND a.assessment_id IN (
              SELECT assessment_id FROM assessments_marks
          )
    """, (teacherid, campusid))

    assessments = cursor.fetchall()

    for assessment in assessments:
        if assessment['assessment_type'] == 'Monthly':
            assessment['sequence_number'] = assessment['sequence'] - 99
        else:
            assessment['sequence_number'] = assessment['sequence']

    cursor.close()
    conn.close()

    return render_template('marked_assessment.html', assessments=assessments)


#List of Unmarked and Marked Quizzes for Teacher dashboard
@assessment_bp.route('/unmarked_quizzes')
@auth.login_required('teacher')
def unmarked_quizzes():
    teacherid = session['username']

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)


    # Retrieve unmarked quizzes for the teacher
    cursor.execute("""
        SELECT q.quiz_id, s.subject_name, a.assessment_type, q.quiz_number, a.sequence AS monthly_sequence
        FROM quizzes q
        JOIN Assessments a ON q.monthly_assessment_id = a.assessment_id
        JOIN Subjects s ON q.subject_id = s.subject_id
        WHERE a.teacherid = %s 
          AND q.quiz_id NOT IN (
              SELECT quiz_id FROM quiz_marks
          )
    """, (teacherid,))

    quizzes = cursor.fetchall()

    # Calculate the display monthly number
    for quiz in quizzes:
        if quiz['monthly_sequence'] is not None:
            if quiz['assessment_type'] == 'Monthly':
                quiz['monthly_number'] = quiz['monthly_sequence'] - 99
            else:
                quiz['monthly_number'] = quiz['monthly_sequence']
        else:
            quiz['monthly_number'] = 'Unknown'  # Handle case where sequence is None

    cursor.close()
    conn.close()

    return render_template('unmarked_quizzes.html', quizzes=quizzes)

@assessment_bp.route('/marked_quizzes')
@auth.login_required('teacher')
def marked_quizzes():
    teacherid = session['username']

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    # Retrieve the marked quizzes for the teacher
    cursor.execute("""
        SELECT q.quiz_id, s.subject_name, a.assessment_type, q.quiz_number, a.sequence AS monthly_sequence
        FROM quizzes q
        JOIN Assessments a ON q.monthly_assessment_id = a.assessment_id
        JOIN Subjects s ON q.subject_id = s.subject_id
        WHERE a.teacherid = %s
          AND q.quiz_id IN (
              SELECT quiz_id FROM quiz_marks
          )
    """, (teacherid,))

    quizzes = cursor.fetchall()

    # Calculate the display monthly number
    for quiz in quizzes:
        if quiz['monthly_sequence'] is not None:
            if quiz['assessment_type'] == 'Monthly':
                quiz['monthly_number'] = quiz['monthly_sequence'] - 99
            else:
                quiz['monthly_number'] = quiz['monthly_sequence']
        else:
            quiz['monthly_number'] = 'Unknown'  # Handle case where sequence is None

    cursor.close()
    conn.close()

    return render_template('marked_quizzes.html', quizzes=quizzes)
#end

#Enter Assessment Marks For Teacher
@assessment_bp.route('/enter_marks/<int:assessment_id>', methods=['GET', 'POST'])
@auth.login_required('teacher')
def enter_marks(assessment_id):
    if request.method == 'POST':
        marks = request.form.getlist('marks')
        rfid_list = request.form.getlist('rfid')
        total_marks = request.form.get('total_marks')

        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        for rfid, mark in zip(rfid_list, marks):
            mark = float(mark) if mark else 0
            cursor.execute("""
                INSERT INTO assessments_marks (rfid, assessment_id, total_marks, Marks_Acheived)
                VALUES (%s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE 
                total_marks = VALUES(total_marks),
                Marks_Acheived = VALUES(Marks_Acheived)
            """, (rfid, assessment_id, total_marks, mark))

        conn.commit()
        cursor.close()
        conn.close()

        return redirect(url_for('unmarked_assessments'))

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)


    teacherid = session['username']
    cursor.execute("SELECT campusid FROM Teachers WHERE teacherid = %s", (teacherid,))
    campusid = cursor.fetchone()['campusid']

    cursor.execute("""
        SELECT s.RFID, s.student_name
        FROM Students s
        JOIN Subjects_Enrolled se ON s.RFID = se.RFID
        JOIN Subjects sub ON se.subject_id = sub.subject_id
        WHERE se.subject_id = (
            SELECT subject_id FROM Assessments WHERE assessment_id = %s
        ) AND s.campusid = %s AND sub.campusid = %s
        ORDER BY s.student_name ASC
    """, (assessment_id, campusid, campusid))

    students = cursor.fetchall()
    cursor.close()
    conn.close()

    return render_template('enter_marks.html', students=students, assessment_id=assessment_id)


#Enter Quiz Marks For Teacher
@assessment_bp.route('/enter_quiz_marks/<int:quiz_id>', methods=['GET', 'POST'])
@auth.login_required('teacher')
def enter_quiz_marks(quiz_id):
    if request.method == 'POST':
        marks = request.form.getlist('marks')
        rfid_list = request.form.getlist('rfid')
        total_marks = request.form.get('total_marks')

        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        for rfid, mark in zip(rfid_list, marks):
            mark = float(mark) if mark else 0
            cursor.execute("""
                INSERT INTO quiz_marks (rfid, quiz_id, marks_achieved)
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE 
                marks_achieved = VALUES(marks_achieved)
            """, (rfid, quiz_id, mark))

        conn.commit()
        cursor.close()
        conn.close()

        return redirect(url_for('unmarked_quizzes'))

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    teacherid = session['username']
    cursor.execute("SELECT campusid FROM Teachers WHERE teacherid = %s", (teacherid,))
    campusid = cursor.fetchone()['campusid']

    cursor.execute("""
        SELECT s.RFID, s.student_name
        FROM Students s
        JOIN Subjects_Enrolled se ON s.RFID = se.RFID
        JOIN Assessments a ON se.subject_id = a.subject_id
        JOIN Subjects sub ON a.subject_id = sub.subject_id
        WHERE a.assessment_id = (
            SELECT monthly_assessment_id FROM quizzes WHERE quiz_id = %s
        ) AND s.campusid = %s AND sub.campusid = %s
        ORDER BY s.student_name ASC
    """, (quiz_id, campusid, campusid))

    students = cursor.fetchall()
    cursor.close()
    conn.close()

    return render_template('enter_quiz_marks.html', students=students, quiz_id=quiz_id)


