from flask import Blueprint, request, jsonify
from src.DatabaseConnection import Database
import os
from werkzeug.utils import secure_filename
from flask import request, jsonify
from datetime import datetime


PROFILE_PICTURE_FOLDER = 'static/profilePictures'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 2MB

StudentProfile_bp = Blueprint('StudentProfile', __name__)
db = Database()


@StudentProfile_bp.route('/get_student_info', methods=['GET'])
def get_student_info():
    rfid = request.args.get('rfid')

    if not rfid:
        return jsonify({"error": "Missing RFID"}), 400

    try:
        query = """
            SELECT 
                student_name,
                phone_number,
                year,
                picture_url
            FROM Students
            WHERE RFID = %s
        """

        student_data = db.fetch_one(query, (rfid,))

        if not student_data:
            return jsonify({"error": "Student not found"}), 404

        student_data["picture_url"]="http://193.203.162.232:5000" + student_data["picture_url"]
        print(student_data["picture_url"])

        return jsonify({
            "status": "success",
            "student_name": student_data["student_name"],
            "phone_number": student_data["phone_number"],
            "year": student_data["year"],
            "picture_url": student_data["picture_url"]
        })

    except Exception as e:
        print("Error:", str(e))
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500



def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@StudentProfile_bp.route('/profile', methods=['GET'])
def get_user_profile():
    rfid = request.args.get('rfid')

    if not rfid:
        return jsonify({"error": "Missing RFID"}), 400

    try:
        query = """
            SELECT 
                student_name AS name,
                'Student' AS role,
                picture_url AS profilePicture
            FROM Students
            WHERE RFID = %s
        """

        user_data = db.fetch_one(query, (rfid,))

        if not user_data:
            return jsonify({"error": "User not found"}), 404

        # Prepend domain if picture_url exists
        if user_data["profilePicture"]:
            user_data["profilePicture"] = "http://193.203.162.232:5000" + user_data["profilePicture"]

        return jsonify({
            "status": "success",
            "name": user_data["name"],
            "role": user_data["role"],
            "profilePicture": user_data["profilePicture"]
        })

    except Exception as e:
        print("Error:", str(e))
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500



@StudentProfile_bp.route('/upload-profile-picture', methods=['POST'])
def upload_profile_picture():
    if 'profilePicture' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['profilePicture']
    rfid = request.form.get('rfid')

    if not rfid:
        return jsonify({"error": "Missing RFID"}), 400

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        # Check file size
        file.seek(0, os.SEEK_END)
        file_length = file.tell()
        file.seek(0)

        if file_length > MAX_FILE_SIZE:
            return jsonify({"error": "File size exceeds 2MB limit"}), 400

        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = f"{rfid}_{timestamp}.{ext}"
        filename = secure_filename(filename)

        # Save file
        if not os.path.exists(PROFILE_PICTURE_FOLDER):
            os.makedirs(PROFILE_PICTURE_FOLDER)

        file_path = os.path.join(PROFILE_PICTURE_FOLDER, filename)
        file.save(file_path)

        try:
            # Update database with new picture path
            update_query = """
                UPDATE Students SET picture_url = %s WHERE RFID = %s;
                UPDATE Teachers SET picture_url = %s WHERE RFID = %s;
                UPDATE Admins SET picture_url = %s WHERE RFID = %s;
            """
            db.execute(update_query, (filename, rfid, filename, rfid, filename, rfid))

            return jsonify({
                "status": "success",
                "message": "Profile picture updated successfully",
                "filename": filename
            })

        except Exception as e:
            # Delete the file if database update fails
            if os.path.exists(file_path):
                os.remove(file_path)
            print("Error:", str(e))
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    return jsonify({"error": "Invalid file type"}), 400