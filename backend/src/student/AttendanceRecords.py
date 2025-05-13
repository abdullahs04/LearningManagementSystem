from flask import Blueprint, request, jsonify
from src.DatabaseConnection import Database
from datetime import date,datetime,timedelta
from collections import defaultdict

db = Database()
StudentAttendance_bp = Blueprint('StudentAttendance_bp', __name__)


@StudentAttendance_bp.route('/get_courses', methods=['GET', 'POST'])  # allow GET too
def get_courses():
    try:
        rfid = request.args.get('rfid')  # Get RFID from request
        if not rfid:
            return jsonify({"error": "RFID is required"}), 400

        # Get enrolled subjects for the student
        query = """
            SELECT s.subject_id, s.subject_name, s.teacher_name, se.TotalDays ,se.SubjectAttended
            FROM Subjects s
            JOIN Subjects_Enrolled se ON s.subject_id = se.subject_id
            WHERE se.RFID = %s
        """
        result = db.fetch_all(query, (rfid,))

        if not result:
            return jsonify({"message": "No subjects found for this student"}), 404

        courses = [{"subject_id": row["subject_id"], "subject_name": row["subject_name"],
                    "teacher_name": row["teacher_name"], "total_classes": row["TotalDays"], "subject_attended":row["SubjectAttended"]} for row in result]

        return jsonify(courses), 200

    except Exception as e:
        print(f"🔥 Error fetching courses: {str(e)}")
        return jsonify({"error": "An error occurred while fetching courses"}), 500


@StudentAttendance_bp.route('/get_attendance_subject', methods=['GET'])
def get_attendance_subject():
    try:
        rfid = request.args.get('rfid')
        subject_id = request.args.get('subject_id')
        if not rfid or not subject_id:
            return jsonify({"error": "RFID and Subject ID are required"}), 400

        query = """
            SELECT sa.attendance_status, sa.date, sa.time 
            FROM Subject_Attendance sa
            WHERE sa.RFID = %s AND sa.subject_id = %s
            ORDER BY sa.date
        """
        result = db.fetch_all(query, (rfid, subject_id))

        if not result:
            return jsonify({"message": "No attendance records found for this subject"}), 404

        attendance = []
        for row in result:
            # Format time from timedelta
            time_str = str(row["time"]) if isinstance(row["time"], timedelta) else row["time"].strftime('%H:%M:%S')

            attendance.append({
                "date": row["date"].strftime('%Y-%m-%d') if row["date"] else None,
                "time": time_str,
                "status": row["attendance_status"]
            })

        return jsonify(attendance), 200

    except Exception as e:
        print(f"🔥 Error fetching attendance: {str(e)}")
        return jsonify({"error": "An error occurred while fetching attendance"}), 500
