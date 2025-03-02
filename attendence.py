# attendence.py

from flask import Blueprint, request, jsonify, render_template, send_file
from datetime import datetime, timedelta
import mysql.connector
import pandas as pd
from io import BytesIO
from database import Database

attendence_bp = Blueprint('attendence', __name__)

class RFIDHandler:
    def __init__(self, db):
        self.db = db

    def check_rfid_exists(self, rfid):
        result = self.db.fetch_data("SELECT * FROM Students WHERE RFID = %s", (rfid,))
        if len(result) > 0:
            return rfid

        alternative_result = self.db.fetch_data("SELECT rfid FROM Alternative_Rfid WHERE Card_Rfid = %s", (rfid,))
        if len(alternative_result) > 0:
            alternative_rfid = alternative_result[0][0]
            result_from_students = self.db.fetch_data("SELECT * FROM Students WHERE RFID = %s", (alternative_rfid,))
            if len(result_from_students) > 0:
                return result_from_students[0]
        return None

    def check_employee_exists(self, rfid):
        result = self.db.fetch_data("SELECT * FROM employee WHERE RFID = %s", (rfid,))
        return len(result) > 0

    def check_general_attendance_exists(self, rfid, date):
        result = self.db.fetch_data("SELECT * FROM General_Attendance WHERE RFID = %s AND date = %s", (rfid, date))
        return len(result) > 0

    def check_subject_attendance_exists(self, rfid, subject_id, date):
        result = self.db.fetch_data("SELECT * FROM Subject_Attendance WHERE RFID = %s AND subject_id = %s AND date = %s", (rfid, subject_id, date))
        return len(result) > 0

    def mark_general_attendance(self, rfid, date_time):
        try:
            if self.check_rfid_exists(rfid):
                date_time_obj = datetime.strptime(date_time, '%Y-%m-%d %H:%M:%S')
                rfid = self.check_rfid_exists(rfid)
                if not self.check_general_attendance_exists(rfid, date_time_obj.date()):
                    self.db.execute_query("INSERT INTO General_Attendance (RFID, date, time, status) VALUES (%s, %s, %s, %s)", (rfid, date_time_obj.date(), date_time_obj.time(), 'Present'))
                    self.db.execute_query("UPDATE Students SET DaysAttended = DaysAttended + 1 WHERE RFID = %s", (rfid,))
                    self.db.execute_query("UPDATE Students SET TotalDays = TotalDays + 1 WHERE RFID = %s", (rfid,))
                    return "General attendance marked and DaysAttended incremented successfully!", 200
                else:
                    return "General attendance already marked for today.", 400
            else:
                return "RFID does not exist in the student table.", 404
        except mysql.connector.Error as e:
            return f"MySQL Error: {e}", 500

    def mark_subject_attendance(self, rfid, date_time):
        try:
            if self.check_rfid_exists(rfid):
                date_time_obj = datetime.strptime(date_time, '%Y-%m-%d %H:%M:%S')
                current_day = date_time_obj.strftime('%A')
                enrolled_subject = self.db.fetch_data("SELECT se.subject_id, su.time, su.day FROM Subjects_Enrolled se JOIN Subjects su ON se.subject_id = su.subject_id WHERE se.RFID = %s AND su.day = %s", (rfid, current_day))
                if enrolled_subject:
                    subject_id, subject_time, subject_day = enrolled_subject[0]
                    if subject_time is None:
                        return f"Subject time for subject ID {subject_id} is None.", 400
                    subject_time_obj = datetime.strptime(str(subject_time), '%H:%M:%S').time()
                    subject_datetime = datetime.combine(date_time_obj.date(), subject_time_obj)
                    if abs((date_time_obj - subject_datetime).total_seconds()) <= 40 * 60:
                        if not self.check_subject_attendance_exists(rfid, subject_id, date_time_obj.date()):
                            self.db.execute_query("INSERT INTO Subject_Attendance (RFID, subject_id, attendance_status, date, time) VALUES (%s, %s, 'Present', %s, %s)", (rfid, subject_id, date_time_obj.date(), date_time_obj.time()))
                            self.db.execute_query("UPDATE Subjects_Enrolled SET SubjectAttended = SubjectAttended + 1 WHERE RFID = %s AND subject_id = %s", (rfid, subject_id))
                            self.db.execute_query("UPDATE Subjects_Enrolled SET TotalDays = TotalDays + 1 WHERE RFID = %s AND subject_id = %s", (rfid, subject_id))
                            return f"Subject attendance marked and SubjectAttended incremented successfully for subject ID {subject_id} on {subject_day}!", 200
                        else:
                            return f"Subject attendance already marked for subject ID {subject_id} today.", 400
                    else:
                        return "Attendance marking time window exceeded.", 400
                else:
                    return "No subject found for the current day and time.", 404
            else:
                return "RFID does not exist in the student table.", 404
        except mysql.connector.Error as e:
            return f"MySQL Error: {e}", 500

    def general_attendance(self):
        try:
            general_attendance_data = self.db.fetch_data("""
                SELECT ga.RFID, s.student_name, ga.date, ga.time, ga.status
                FROM General_Attendance ga
                JOIN Students s ON ga.RFID = s.RFID
            """)
            current_date = datetime.now().strftime('%Y-%m-%d')
            return render_template('general_attendance.html', general_attendance_data=general_attendance_data, current_date=current_date)
        except mysql.connector.Error as e:
            print("MySQL Error:", e)
            return jsonify([])

    def search_general_attendance(self):
        rfid = request.args.get('rfid', '')
        start_date = request.args.get('start_date', '')
        end_date = request.args.get('end_date', '')

        try:
            query = """
                SELECT ga.RFID, s.student_name, ga.date, ga.status
                FROM General_Attendance ga
                JOIN Students s ON ga.RFID = s.RFID
            """
            params = []
            if rfid:
                query += " WHERE ga.RFID = %s"
                params.append(rfid)
            if start_date and end_date:
                if rfid:
                    query += " AND ga.date BETWEEN %s AND %s"
                else:
                    query += " WHERE ga.date BETWEEN %s AND %s"
                params.extend([start_date, end_date])
            elif start_date:
                if rfid:
                    query += " AND ga.date >= %s"
                else:
                    query += " WHERE ga.date >= %s"
                params.append(start_date)
            elif end_date:
                if rfid:
                    query += " AND ga.date <= %s"
                else:
                    query += " WHERE ga.date <= %s"
                params.append(end_date)

            general_attendance_data = self.db.fetch_data(query, params)
            return jsonify(general_attendance_data)
        except mysql.connector.Error as e:
            print("MySQL Error:", e)
            return jsonify([])

    def export_general_attendance(self):
        start_date = request.args.get('start_date', '')
        end_date = request.args.get('end_date', '')

        query = """
            SELECT ga.RFID, s.student_name, ga.date, ga.time, ga.status
            FROM General_Attendance ga
            JOIN Students s ON ga.RFID = s.RFID
        """
        params = []
        if start_date and end_date:
            query += " WHERE ga.date BETWEEN %s AND %s"
            params.extend([start_date, end_date])
        elif start_date:
            query += " WHERE ga.date >= %s"
            params.append(start_date)
        elif end_date:
            query += " WHERE ga.date <= %s"
            params.append(end_date)

        try:
            general_attendance_data = self.db.fetch_data(query, params)
            df = pd.DataFrame(general_attendance_data, columns=['RFID', 'Student Name', 'Date', 'Time', 'Status'])
            df['Time'] = df['Time'].apply(lambda x: str(x).split()[2])
            df['Time'] = pd.to_datetime(df['Time'], format='%H:%M:%S').dt.time

            output = BytesIO()
            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, index=False, sheet_name='General Attendance')
            output.seek(0)
            return send_file(output, download_name='general_attendance.xlsx', as_attachment=True)
        except mysql.connector.Error as e:
            print("MySQL Error:", e)
            return jsonify([])

    def subject_attendance(self):
        try:
            start_date = request.args.get('start_date')
            end_date = request.args.get('end_date')

            query = """
                SELECT sa.RFID, s.student_name, su.subject_name, sa.attendance_status, sa.date, sa.time
                FROM Subject_Attendance sa
                JOIN Students s ON sa.RFID = s.RFID
                JOIN Subjects su ON sa.subject_id = su.subject_id
                WHERE 1=1
            """
            params = []

            if start_date:
                query += " AND sa.date >= %s"
                params.append(start_date)
            if end_date:
                query += " AND sa.date <= %s"
                params.append(end_date)

            subject_attendance_data = self.db.fetch_data(query, tuple(params))
            return render_template('subject_attendance.html', subject_attendance_data=subject_attendance_data)
        except mysql.connector.Error as e:
            print("MySQL Error:", e)
            return jsonify([])

    def search_subject_attendance(self):
        rfid = request.args.get('rfid')
        subject_id = request.args.get('subject_id')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')

        query = """
            SELECT sa.RFID, s.student_name, su.subject_name, sa.attendance_status, sa.date
            FROM Subject_Attendance sa
            JOIN Students s ON sa.RFID = s.RFID
            JOIN Subjects su ON sa.subject_id = su.subject_id
            WHERE 1=1
        """
        params = []

        if rfid:
            query += " AND sa.RFID = %s"
            params.append(rfid)
        if subject_id:
            query += " AND sa.subject_id = %s"
            params.append(subject_id)
        if start_date:
            query += " AND sa.date >= %s"
            params.append(start_date)
        if end_date:
            query += " AND sa.date <= %s"
            params.append(end_date)

        data = self.db.fetch_data(query, tuple(params))
        return jsonify(data)

    def export_subject_attendance_to_excel(self):
        rfid = request.args.get('rfid')
        subject_id = request.args.get('subject_id')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')

        query = """
            SELECT sa.RFID, s.student_name, su.subject_name, sa.attendance_status, sa.date, sa.time
            FROM Subject_Attendance sa
            JOIN Students s ON sa.RFID = s.RFID
            JOIN Subjects su ON sa.subject_id = su.subject_id
            WHERE 1=1
        """
        params = []

        if rfid:
            query += " AND sa.RFID = %s"
            params.append(rfid)
        if subject_id:
            query += " AND sa.subject_id = %s"
            params.append(subject_id)
        if start_date:
            query += " AND sa.date >= %s"
            params.append(start_date)
        if end_date:
            query += " AND sa.date <= %s"
            params.append(end_date)

        data = self.db.fetch_data(query, tuple(params))
        df = pd.DataFrame(data, columns=['RFID', 'Student Name', 'Subject Name', 'Attendance Status', 'Date', 'Time'])
        df['Date'] = pd.to_datetime(df['Date']).dt.strftime('%Y-%m-%d')
        df['Time'] = df['Time'].astype(str).str.extract(r'(\d+:\d+:\d+)')[0]

        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Subject Attendance')
        output.seek(0)
        return send_file(output, download_name='subject_attendance.xlsx', as_attachment=True)

# Register the blueprint
@attendence_bp.route('/mark_general_attendance', methods=['POST'])
def mark_general_attendance():
    rfid = request.form['rfid']
    date_time = request.form['date_time']
    handler = RFIDHandler(Database())
    message, status = handler.mark_general_attendance(rfid, date_time)
    return jsonify({'message': message}), status

@attendence_bp.route('/mark_subject_attendance', methods=['POST'])
def mark_subject_attendance():
    rfid = request.form['rfid']
    date_time = request.form['date_time']
    handler = RFIDHandler(Database())
    message, status = handler.mark_subject_attendance(rfid, date_time)
    return jsonify({'message': message}), status

@attendence_bp.route('/general_attendance', methods=['GET'])
def general_attendance():
    handler = RFIDHandler(Database())
    return handler.general_attendance()

@attendence_bp.route('/search_general_attendance', methods=['GET'])
def search_general_attendance():
    handler = RFIDHandler(Database())
    return handler.search_general_attendance()

@attendence_bp.route('/export_general_attendance', methods=['GET'])
def export_general_attendance():
    handler = RFIDHandler(Database())
    return handler.export_general_attendance()

@attendence_bp.route('/subject_attendance', methods=['GET'])
def subject_attendance():
    handler = RFIDHandler(Database())
    return handler.subject_attendance()

@attendence_bp.route('/search_subject_attendance', methods=['GET'])
def search_subject_attendance():
    handler = RFIDHandler(Database())
    return handler.search_subject_attendance()

@attendence_bp.route('/export_subject_attendance_to_excel', methods=['GET'])
def export_subject_attendance_to_excel():
    handler = RFIDHandler(Database())
    return handler.export_subject_attendance_to_excel()