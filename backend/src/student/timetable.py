from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta, time
import random
import traceback
from src.DatabaseConnection import Database

db = Database()
timetable_bp = Blueprint("timetable_bp", __name__)

def generate_random_times(count):
    used_times = set()
    generated = []

    while len(generated) < count:
        hour = random.randint(8, 12)  # 08:00 to 12:59
        minute = random.choice([0, 30])
        t = time(hour, minute)
        if t not in used_times:
            used_times.add(t)
            generated.append(t)

    return generated

@timetable_bp.route("/get_timetable", methods=["POST"])
def get_timetable():
    try:
        data = request.get_json()
        rfid = data.get("rfid", None)
        if not rfid:
            return jsonify({"error": "rfid is required"}), 400

        day_today = datetime.today().strftime('%A')

        query = """
            SELECT s.subject_id, s.subject_name, s.time
            FROM Subjects_Enrolled se
            JOIN Subjects s ON se.subject_id = s.subject_id
            WHERE se.RFID = %s AND s.day = %s
        """
        subjects = db.fetch_all(query, (rfid, day_today))

        count = len(subjects)
        random_times = generate_random_times(count)

        timetable = []
        for i, sub in enumerate(subjects):
            start_time = sub["time"] or random_times[i]
            start_datetime = datetime.combine(datetime.today(), start_time)
            end_datetime = start_datetime + timedelta(hours=1)

            timetable.append({
                "id": str(sub.get("subject_id", i + 1)),
                "title": sub["subject_name"],
                "start": int(start_datetime.timestamp() * 1000),  # JavaScript timestamp
                "end": int(end_datetime.timestamp() * 1000),
                "backgroundColor": "#4B5563",
                "textColor": "#FFFFFF",
                "extendedProps": {
                    "courseCode": f"{sub.get('subject_id', 'SUB')}",
                    "courseTitle": sub["subject_name"]
                }
            })

        return jsonify({
            "status": "success",
            "timetable": timetable
        })

    except Exception as e:
        print("Error:", str(e))
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



@timetable_bp.route("/get_weekly_timetable", methods=["POST"])
def get_weekly_timetable():
    try:
        data = request.get_json()
        rfid = data.get("rfid", None)
        if not rfid:
            return jsonify({"error": "rfid is required"}), 400

        weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        full_timetable = []

        for day_index, day_name in enumerate(weekdays):
            query = """
                SELECT s.subject_id, s.subject_name, s.time
                FROM Subjects_Enrolled se
                JOIN Subjects s ON se.subject_id = s.subject_id
                WHERE se.RFID = %s AND s.day = %s
            """
            subjects = db.fetch_all(query, (rfid, day_name))
            count = len(subjects)

            # Generate random unique times for the day if missing
            used_times = set()
            def get_random_time():
                while True:
                    hour = random.randint(8, 12)
                    if hour not in used_times:
                        used_times.add(hour)
                        return time(hour=hour, minute=0)

            for i, sub in enumerate(subjects):
                subject_time = sub["time"] or get_random_time()
                today_date = datetime.now().date()
                day_offset = (day_index - datetime.now().weekday()) % 7
                class_date = today_date + timedelta(days=day_offset)
                start_datetime = datetime.combine(class_date, subject_time)
                end_datetime = start_datetime + timedelta(hours=1)

                full_timetable.append({
                    "id": str(sub.get("subject_id", i + 1)),
                    "title": sub["subject_name"],
                    "start": int(start_datetime.timestamp() * 1000),
                    "end": int(end_datetime.timestamp() * 1000),
                    "backgroundColor": "#4B5563",
                    "textColor": "#FFFFFF",
                    "extendedProps": {
                        "courseCode": f"{sub.get('subject_id', 'SUB')}",
                        "courseTitle": sub["subject_name"]
                    }
                })

        return jsonify({
            "status": "success",
            "timetable": full_timetable
        })

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500