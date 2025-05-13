from flask import Blueprint, request, jsonify
from src.DatabaseConnection import Database

metrics_bp = Blueprint('metrics', __name__)
db = Database()

@metrics_bp.route('/student_metrics', methods=['GET'])
def student_metrics():
    try:
        student_rfid = request.args.get('student_rfid')
        if not student_rfid:
            return jsonify({'error': 'Missing student_rfid'}), 400

        student_rfid = int(student_rfid)

        # 1. Count current courses
        sql_courses = "SELECT COUNT(*) AS total_courses FROM Subjects_Enrolled WHERE rfid = %s"
        courses_result = db.fetch_one(sql_courses, (student_rfid,))
        current_courses = courses_result['total_courses'] if courses_result else 0

        # 2. Average percentage from assessments

        avg_percentage = calculate_average_score(student_rfid)

        # 3. Pending assignments
        sql_pending = """
            SELECT COUNT(*) AS pending
            FROM Assignments a
            LEFT JOIN Submissions s ON a.assignment_id = s.assignment_id AND s.student_rfid = %s
            WHERE a.subject_id IN (
                SELECT subject_id FROM Subjects_Enrolled WHERE rfid = %s
            )
            AND s.submission_id IS NULL
        """
        pending_result = db.fetch_one(sql_pending, (student_rfid, student_rfid))
        pending_assignments = pending_result['pending'] if pending_result else 0

        # 4. Average attendance
        sql_attendance = """
            SELECT 
                (SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS avg_attendance
            FROM General_Attendance
            WHERE rfid = %s
        """
        attendance_result = db.fetch_one(sql_attendance, (student_rfid,))
        avg_attendance = round(attendance_result['avg_attendance'], 2) if attendance_result and attendance_result['avg_attendance'] else 0

        return jsonify({
            "current_courses": current_courses,
            "average_percentage": avg_percentage,
            "pending_assignments": pending_assignments,
            "average_attendance": avg_attendance
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



def calculate_average_score(rfid):
    try:
        results = {}
        total_marks_all = 0
        total_achieved_all = 0

        subject_query = """SELECT s.subject_id, s.subject_name 
                           FROM Subjects_Enrolled se 
                           JOIN Subjects s ON se.subject_id = s.subject_id 
                           WHERE se.RFID = %s"""
        subjects = db.fetch_all(subject_query, (rfid,))

        for subject in subjects:
            subject_id = subject["subject_id"]
            subject_name = subject["subject_name"]

            assessment_query = """
                SELECT am.Marks_Acheived, a.total_marks 
                FROM assessments_marks am
                JOIN Assessments a ON am.assessment_id = a.assessment_id
                WHERE am.rfid = %s AND a.subject_id = %s
            """
            assessments = db.fetch_all(assessment_query, (rfid, subject_id))

            quiz_query = """
                SELECT qm.marks_achieved, q.total_marks 
                FROM quiz_marks qm
                JOIN quizzes q ON qm.quiz_id = q.quiz_id
                WHERE qm.rfid = %s AND q.subject_id = %s
            """
            quizzes = db.fetch_all(quiz_query, (rfid, subject_id))

            total_achieved = 0
            total_marks = 0

            for a in assessments:
                if a["Marks_Acheived"] is not None and a["total_marks"]:
                    total_achieved += a["Marks_Acheived"]
                    total_marks += a["total_marks"]

            for q in quizzes:
                if q["marks_achieved"] is not None and q["total_marks"]:
                    total_achieved += q["marks_achieved"]
                    total_marks += q["total_marks"]

            percentage = (total_achieved / total_marks) * 100 if total_marks else 0
            results[subject_name] = f"{percentage:.2f}%"

            total_achieved_all += total_achieved
            total_marks_all += total_marks

        overall_percentage = (total_achieved_all / total_marks_all) * 100 if total_marks_all else 0
        return round(overall_percentage)

    except Exception as e:
        print("Error in calculate_average_score:", str(e))
        return 0

@metrics_bp.route('/get_overall_percentage', methods=['GET'])
def get_average_score():
    try:
        rfid = request.args.get('rfid')
        if not rfid:
            return jsonify({"error": "RFID is required"}), 400

        overall_percentage = calculate_average_score(rfid)
        return jsonify({
            "rfid": rfid,
            "overall_percentage": overall_percentage
        })


    except Exception as e:
        return jsonify({"error": str(e)}), 500



@metrics_bp.route('/get_student_year', methods=['GET'])
def get_student_year():
    try:
        rfid = request.args.get('rfid')
        if not rfid:
            return jsonify({"error": "RFID is required"}), 400

        query = "SELECT year FROM Students WHERE rfid = %s"
        result = db.fetch_one(query, (rfid,))

        if result and "year" in result:
            return jsonify({"year": result["year"]})
        else:
            return jsonify({"year": None}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

