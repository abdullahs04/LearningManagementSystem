import mysql.connector
import json
from src.database import DB_CONFIG
from src.auth import Auth
from flask import Blueprint, request, session, url_for
from datetime import datetime
import os
from werkzeug.utils import secure_filename
import pytz
from datetime import timedelta



auth = Auth()
assessment_bp = Blueprint('assessment', __name__)


@assessment_bp.route('/api/make_assessment', methods=['POST'])
@auth.login_required('teacher')
def make_assessment():
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    try:
        teacherid = session['username']
        subjects = fetch_teacher_subjects(cursor, teacherid)
    except mysql.connector.Error as err:
        return jsonify({'error': f'Database Error: {err}'}), 500
    finally:
        cursor.close()
        conn.close()

    data = request.json
    return handle_assessment_submission(teacherid, subjects, data)


def fetch_teacher_subjects(cursor, teacherid):
    cursor.execute("SELECT subject_id, subject_name FROM Subjects WHERE teacherid = %s", (teacherid,))
    return cursor.fetchall()


def handle_assessment_submission(teacherid, subjects, data):
    assessment_type = data.get('assessment_type')
    total_marks = get_total_marks(data, assessment_type)
    grading_criteria = get_grading_criteria(data)
    subject_id = data.get('subject_id')
    created_at = parse_datetime(data.get('created_at'))

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    try:
        if assessment_exists(cursor, teacherid, subject_id, assessment_type, created_at):
            return jsonify({'error': f'Assessment of type {assessment_type} already exists this month'}), 400

        sequence = get_next_sequence(cursor, subject_id, assessment_type)
        assessment_id = insert_assessment(cursor, teacherid, subject_id, assessment_type, total_marks, grading_criteria,
                                          sequence, created_at)

        if assessment_type == 'Monthly':
            insert_quizzes(cursor, assessment_id, subject_id)

        conn.commit()
        return jsonify({'message': 'Assessment created successfully', 'assessment_id': assessment_id}), 201
    except mysql.connector.Error as err:
        conn.rollback()
        return jsonify({'error': f'Database Error: {err}'}), 500
    finally:
        cursor.close()
        conn.close()


def get_total_marks(data, assessment_type):
    total_marks = data.get('total_marks')
    return int(total_marks) if total_marks else (
        15 if assessment_type == 'Quiz' else 35 if assessment_type == 'Monthly' else 0)


def get_grading_criteria(data):
    return {
        "A*": data.get('grade_A_star', 90),
        "A": data.get('grade_A', 80),
        "B": data.get('grade_B', 70),
        "C": data.get('grade_C', 60),
        "D": data.get('grade_D', 50),
        "E": data.get('grade_E', 40),
        "F": data.get('grade_F', 30)
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
    return cursor.fetchone()['count'] > 0


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


@assessment_bp.route('/api/view_submissions/<int:subject_id>', methods=['GET'])
@auth.login_required('teacher')
def view_submissions(subject_id):
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)
    try:
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
        return jsonify({'submissions': submissions}), 200
    except mysql.connector.Error as err:
        return jsonify({'error': f'Database Error: {err}'}), 500
    finally:
        cursor.close()
        conn.close()


#End Submissions

@assessment_bp.route('/api/view_quiz_marks/<int:quiz_id>', methods=['GET'])
@auth.login_required('teacher')
def view_quiz_marks(quiz_id):
    """Fetch and return quiz marks as JSON."""
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
        return jsonify({"error": "Quiz not found"}), 404

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

    return jsonify({"quiz": quiz, "marks": marks})


@assessment_bp.route('/api/update_marks', methods=['POST'])
@auth.login_required('teacher')
def update_marks():
    """Update quiz marks and return JSON response."""
    data = request.get_json()
    quiz_id = data.get('quiz_id')
    rfid = data.get('rfid')
    new_marks = data.get('new_marks')

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()

    try:
        cursor.execute("""
            UPDATE quiz_marks 
            SET marks_achieved = %s 
            WHERE quiz_id = %s AND rfid = %s
        """, (new_marks, quiz_id, rfid))
        conn.commit()
        return jsonify({"message": "Marks updated successfully!"})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@assessment_bp.route('/api/view_marks/<int:assessment_id>', methods=['GET'])
@auth.login_required('teacher')
def view_marks(assessment_id):
    """Fetch and return assessment marks as JSON."""
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT a.assessment_id, s.subject_name, a.assessment_type
        FROM Assessments a
        JOIN Subjects s ON a.subject_id = s.subject_id
        WHERE a.assessment_id = %s
    """, (assessment_id,))
    assessment = cursor.fetchone()

    if not assessment:
        return jsonify({"error": "Assessment not found"}), 404

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

    return jsonify({"assessment": assessment, "marks": marks})


@assessment_bp.route('/api/update_assessment_marks', methods=['POST'])
@auth.login_required('teacher')
def update_assessment_marks():
    """Update assessment marks and return JSON response."""
    data = request.get_json()
    assessment_id = data.get('assessment_id')
    rfid = data.get('rfid')
    new_marks = data.get('new_marks')

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()

    try:
        cursor.execute("""
            UPDATE assessments_marks SET Marks_Acheived = %s 
            WHERE assessment_id = %s AND rfid = %s
        """, (new_marks, assessment_id, rfid))
        conn.commit()
        return jsonify({"message": "Marks updated successfully!"})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()





# Subject Wise Assessment Details API

@assessment_bp.route('/api/view_assessment_details/<int:subject_id>')
@auth.login_required('admin')
def view_assessment_details(subject_id):
    """Fetch and return assessment details for a given subject."""
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

    return jsonify({'subject_id': subject_id, 'assessments': processed_data})


@assessment_bp.route('/api/unmarked_assessments')
@auth.login_required('teacher')
def unmarked_assessments():
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
          AND a.assessment_id NOT IN (
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

    return jsonify({'unmarked_assessments': assessments})


@assessment_bp.route('/api/marked_assessments')
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

    return jsonify({'marked_assessments': assessments})


@assessment_bp.route('/api/unmarked_quizzes', methods=['GET'])
@auth.login_required('teacher')
def unmarked_quizzes():
    teacherid = session['username']

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

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

    for quiz in quizzes:
        if quiz['monthly_sequence'] is not None:
            if quiz['assessment_type'] == 'Monthly':
                quiz['monthly_number'] = quiz['monthly_sequence'] - 99
            else:
                quiz['monthly_number'] = quiz['monthly_sequence']
        else:
            quiz['monthly_number'] = 'Unknown'

    cursor.close()
    conn.close()

    return jsonify(quizzes)


@assessment_bp.route('/api/marked_quizzes', methods=['GET'])
@auth.login_required('teacher')
def marked_quizzes():
    teacherid = session['username']

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

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

    for quiz in quizzes:
        if quiz['monthly_sequence'] is not None:
            if quiz['assessment_type'] == 'Monthly':
                quiz['monthly_number'] = quiz['monthly_sequence'] - 99
            else:
                quiz['monthly_number'] = quiz['monthly_sequence']
        else:
            quiz['monthly_number'] = 'Unknown'

    cursor.close()
    conn.close()

    return jsonify(quizzes)


@assessment_bp.route('/api/enter_marks/<int:assessment_id>', methods=['POST'])
@auth.login_required('teacher')
def enter_marks(assessment_id):
    data = request.get_json()
    marks = data.get('marks', [])
    rfid_list = data.get('rfid', [])
    total_marks = data.get('total_marks')

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

    return jsonify({'message': 'Marks entered successfully'}), 200


@assessment_bp.route('/api/students_for_assessment/<int:assessment_id>', methods=['GET'])
@auth.login_required('teacher')
def students_for_assessment(assessment_id):
    teacherid = session['username']

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

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

    return jsonify(students)


from flask import jsonify


@assessment_bp.route('/api/enter_quiz_marks/<int:quiz_id>', methods=['POST'])
@auth.login_required('teacher')
def enter_quiz_marks(quiz_id):
    data = request.get_json()
    marks = data.get('marks', [])
    rfid_list = data.get('rfid', [])

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

    return jsonify({'message': 'Quiz marks entered successfully'}), 200


@assessment_bp.route('/api/students_for_quiz/<int:quiz_id>', methods=['GET'])
@auth.login_required('teacher')
def students_for_quiz(quiz_id):
    teacherid = session['username']

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

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

    return jsonify(students)


@assessment_bp.route('/api/upload_exam/<int:campus_id>', methods=['POST'])
@auth.login_required('admin')
def upload_exam(campus_id):
    data = request.form
    exam_pdf = request.files.get('exam_pdf')

    if not all([data.get('subject_id'), data.get('start_time'), data.get('end_time'), exam_pdf]):
        return jsonify({'error': 'All fields are required!'}), 400

    pdf_filename = secure_filename(exam_pdf.filename)
    pdf_folder = os.path.join('../static', 'pdfs')
    os.makedirs(pdf_folder, exist_ok=True)
    pdf_path = os.path.join(pdf_folder, pdf_filename)
    exam_pdf.save(pdf_path)

    pst = pytz.timezone('Asia/Karachi')
    gmt = pytz.timezone('GMT')

    start_time = pst.localize(datetime.strptime(data['start_time'], '%Y-%m-%dT%H:%M')).astimezone(gmt)
    end_time = pst.localize(datetime.strptime(data['end_time'], '%Y-%m-%dT%H:%M')).astimezone(gmt)

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO Exams (Subject_id, Exam_PDF, Start_Time, End_Time)
        VALUES (%s, %s, %s, %s)
    """, (data['subject_id'], f'pdfs/{pdf_filename}', start_time, end_time))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Exam uploaded successfully!'}), 200


@assessment_bp.route('/api/subjects_for_exam/<int:campus_id>', methods=['GET'])
@auth.login_required('admin')
def subjects_for_exam(campus_id):
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT Subject_id, Subject_Name, year FROM Subjects WHERE campusid = %s", (campus_id,))
    subjects = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(subjects)


# Exam Submission by students it can be assignment too
@assessment_bp.route('/api/exam_submission/<int:exam_id>', methods=['GET'])
@auth.login_required('student')
def exam_submission(exam_id):
    """Fetch exam details for student submission."""

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT Exam_PDF, Start_Time, End_Time FROM Exams WHERE Exam_ID = %s
    """, (exam_id,))
    exam_data = cursor.fetchone()

    if not exam_data:
        cursor.close()
        conn.close()
        return jsonify({"error": "Exam not found"}), 404

    # Adjust end time by 5 hours
    exam_end_time = exam_data['End_Time'] + timedelta(hours=5)

    cursor.close()
    conn.close()

    return jsonify({
        "exam_pdf": url_for('static', filename=exam_data['Exam_PDF'], _external=True),
        "exam_start_time": exam_data['Start_Time'].isoformat(),
        "exam_end_time": exam_end_time.isoformat(),
        "exam_id": exam_id
    }), 200


# Submission Success Page
@assessment_bp.route('/api/submission_success')
def submission_success():
    """Return a JSON response indicating a successful submission."""
    return jsonify({"message": "Submission successful!"}), 200


# Submit Solution by students
@assessment_bp.route('/api/submit_solution/<int:exam_id>', methods=['POST'])
@auth.login_required('student')
def submit_solution(exam_id):
    """Allow students to submit solutions for an exam via API."""

    if 'rfid' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    solution = request.files.get('solution')

    if not solution or not solution.filename.endswith('.pdf'):
        return jsonify({"error": "Invalid file format. Please upload a PDF."}), 400

    filename = f"{session['rfid']}_{secure_filename(solution.filename)}"
    solution_folder = os.path.join('static', 'solutions')
    os.makedirs(solution_folder, exist_ok=True)
    save_path = os.path.join(solution_folder, filename)
    solution.save(save_path)

    # Insert into database
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO Exam_Submissions (Exam_ID, RFID, Solution_PDF, Submission_Time)
        VALUES (%s, %s, %s, NOW())
    """, (exam_id, session['rfid'], f'solutions/{filename}'))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({
        "message": "Solution submitted successfully!",
        "solution_pdf": url_for('static', filename=f'solutions/{filename}', _external=True)
    }), 201
