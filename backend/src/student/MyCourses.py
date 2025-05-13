from flask import Blueprint, request, jsonify
from src.DatabaseConnection import Database

MyCourses_bp = Blueprint('MyCourses', __name__)
db = Database()


@MyCourses_bp.route('<string:rfid>/MyCourses', methods=['GET'])
def MyCourses(rfid):
    try:
        sql = """
            SELECT s.subject_id, s.subject_name, s.teacher_name
            FROM Subjects s
            JOIN Subjects_Enrolled se ON s.subject_id = se.subject_id
            WHERE se.RFID = %s
        """
        values = (rfid,)
        result = db.fetch_all(sql, values)

        subjects = [
            {
                "id": row["subject_id"] if row["subject_id"] is not None else "None",
                "name": row["subject_name"] if row["subject_name"] is not None else "None",
                "code": row["subject_id"] if row["subject_id"] is not None else "None",  # using subject_id as code
                "instructor": row["teacher_name"] if row["teacher_name"] is not None else "None",
                "description": "None"
            }
            for row in result
        ]
        print(subjects)

        return jsonify({"success": True, "subjects": subjects}), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
