from flask import Blueprint, request, jsonify
from src.DatabaseConnection import Database

campus_bp = Blueprint('campus', __name__)
db = Database()

@campus_bp.route('/get_campuses', methods=['GET'])
def get_campuses():
    try:
        query = "SELECT CampusID, CampusName FROM Campus"
        result = db.fetch_all(query)

        print("Query Result:", result)

        if not result:
            return jsonify({"message": "No campuses found"}), 404
        campuses = [{"CampusID": row["CampusID"], "CampusName": row["CampusName"]} for row in result]

        return jsonify(campuses)
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500
