# teacher.py


from flask import Blueprint, request, render_template, redirect, url_for, flash, session
from datetime import datetime
from collections import defaultdict
import pytz
import mysql.connector
from database import Database
from auth import Auth
import attendence as rfid_handler

auth = Auth()
teacher_bp = Blueprint('teacher', __name__)
db = Database()

# Teacher dashboard
@teacher_bp.route('/dashboard')
@auth.login_required('teacher')
def teacher_dashboard():
    # Fetch data for the dashboard
    attendance_records = db.fetch_data("""
        SELECT ga.RFID, s.student_name, ga.date, ga.status
        FROM General_Attendance ga
        JOIN Students s ON ga.RFID = s.RFID
        ORDER BY ga.date DESC
        LIMIT 5
    """)

    students = db.fetch_data("SELECT * FROM Students ORDER BY student_name LIMIT 5")

    assessments = db.fetch_data("SELECT * FROM Assessments ORDER BY created_at DESC LIMIT 5")

    return render_template('teacher_dashboard.html',
                           attendance_records=attendance_records,
                           students=students,
                           assessments=assessments)

# View and manage student attendance
@teacher_bp.route('/attendance', methods=['GET', 'POST'])
@auth.login_required('teacher')
def manage_attendance():
    if request.method == 'POST':
        rfid = request.form['rfid']
        date = request.form['date']
        status = request.form['status']
        db.execute_query("""
            INSERT INTO General_Attendance (RFID, date, status)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE status = VALUES(status)
        """, (rfid, date, status))
        flash('Attendance updated successfully!', 'success')

    attendance_records = db.fetch_data("""
        SELECT ga.RFID, s.student_name, ga.date, ga.status
        FROM General_Attendance ga
        JOIN Students s ON ga.RFID = s.RFID
        ORDER BY ga.date DESC
    """)

    return render_template('manage_attendance.html', attendance_records=attendance_records)

# View and manage student details
@teacher_bp.route('/students', methods=['GET', 'POST'])
@auth.login_required('teacher')
def manage_students():
    if request.method == 'POST':
        rfid = request.form['rfid']
        student_name = request.form['student_name']
        db.execute_query("""
            INSERT INTO Students (RFID, student_name)
            VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE student_name = VALUES(student_name)
        """, (rfid, student_name))
        flash('Student details updated successfully!', 'success')

    students = db.fetch_data("SELECT * FROM Students ORDER BY student_name")

    return render_template('manage_students.html', students=students)

# Create, view, and manage assessments
@teacher_bp.route('/assessments', methods=['GET', 'POST'])
@auth.login_required('teacher')
def manage_assessments():
    if request.method == 'POST':
        subject_id = request.form['subject_id']
        assessment_type = request.form['assessment_type']
        total_marks = request.form['total_marks']
        created_at = datetime.now()
        db.execute_query("""
            INSERT INTO Assessments (subject_id, assessment_type, total_marks, created_at)
            VALUES (%s, %s, %s, %s)
        """, (subject_id, assessment_type, total_marks, created_at))
        flash('Assessment created successfully!', 'success')

    assessments = db.fetch_data("SELECT * FROM Assessments ORDER BY created_at DESC")

    return render_template('manage_assessments.html', assessments=assessments)

# View and manage assessment marks
@teacher_bp.route('/assessment_marks/<int:assessment_id>', methods=['GET', 'POST'])
@auth.login_required('teacher')
def manage_assessment_marks(assessment_id):
    if request.method == 'POST':
        rfid = request.form['rfid']
        marks_achieved = request.form['marks_achieved']
        db.execute_query("""
            INSERT INTO assessments_marks (rfid, assessment_id, marks_achieved)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE marks_achieved = VALUES(marks_achieved)
        """, (rfid, assessment_id, marks_achieved))
        flash('Marks updated successfully!', 'success')

    marks = db.fetch_data("""
        SELECT am.rfid, s.student_name, am.marks_achieved
        FROM assessments_marks am
        JOIN Students s ON am.rfid = s.RFID
        WHERE am.assessment_id = %s
        ORDER BY s.student_name
    """, (assessment_id,))

    return render_template('manage_assessment_marks.html', marks=marks, assessment_id=assessment_id)

# Update attendance
@teacher_bp.route('/update_attendance', methods=['POST'])
@auth.login_required('admin')
def update_attendance():
    rfid = request.form['rfid']
    new_status = request.form['new_status']
    current_status = request.form['current_status']
    conn = db.get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch current student data using RFID
    query = '''
        SELECT DaysAttended, TotalDays, Fine
        FROM Students
        WHERE RFID = %s
    '''
    cursor.execute(query, (rfid,))
    student = cursor.fetchone()

    if not student:
        return "Student not found", 404

    days_attended = student['DaysAttended']
    total_days = student['TotalDays']
    fine = student['Fine']

    # Update logic based on new status and current status
    if current_status == 'Present':
        if new_status == 'Absent':
            days_attended -= 1  # Decrement days attended
            fine += 100
        elif new_status == 'Leave':
            days_attended -= 1  # Decrement days attended
            # No change to fine

    elif current_status == 'Absent':
        if new_status == 'Present':
            days_attended += 1  # Increment days attended
            fine -= 100
        elif new_status == 'Leave':
            fine -= 100  # Reduce fine
            # No change to days attended

    elif not current_status:  # No status case
        if new_status == 'Present':
            days_attended += 1
            total_days += 1  # Increment both days attended and total days
        elif new_status == 'Absent':
            total_days += 1  # Only increment total days if no previous status
            fine += 100
        elif new_status == 'Leave':
            total_days += 1  # Only increment total days
            # No change to fine

    # Update the student record in the database
    update_query = '''
        UPDATE Students
        SET DaysAttended = %s, TotalDays = %s, Fine = %s
        WHERE RFID = %s
    '''
    cursor.execute(update_query, (days_attended, total_days, fine, rfid))

    # Delete the previous attendance record for the day
    delete_query = '''
        DELETE FROM General_Attendance
        WHERE RFID = %s AND Date = CURDATE()
    '''
    cursor.execute(delete_query, (rfid,))

    # Insert the new attendance record
    attendance_query = '''
        INSERT INTO General_Attendance (RFID, Date, Status, time)
        VALUES (%s, CURDATE(), %s, NOW())
    '''
    cursor.execute(attendance_query, (rfid, new_status))

    conn.commit()
    cursor.close()
    conn.close()

# Update all attendance
@teacher_bp.route('/update_all_attendance', methods=['POST'])
@auth.login_required('admin')
def update_all_attendance():
    campus_id = session.get('campus_id')  # Retrieve campus_id from session

    if not campus_id:
        # Log an error and return a meaningful response if campus_id is not in the session
        # app.logger.error("Campus ID is missing in the session.")
        return "Campus ID is missing!", 400

    # Retrieve student RFID and new status from the form for all students
    students = request.form.to_dict()  # Get all form data as a dictionary

    conn = db.get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Iterate over each student and update their attendance
    for student_rfid, new_status in students.items():
        # The form fields will be like "status_<student_rfid>", so we need to extract the rfid
        if student_rfid.startswith('status_'):
            rfid = student_rfid.split('_')[1]  # Extract the student RFID
            current_status = request.form.get(f"current_status_{rfid}")  # Get current status from form
            update_attendance(rfid, new_status, current_status)  # Call update_attendance method

    conn.commit()  # Commit all changes to the database
    cursor.close()
    conn.close()

    return redirect(url_for('attendance_students', campus_id=campus_id))

# View attendance records
@teacher_bp.route('/view_attendance_records/<int:subject_id>')
@auth.login_required('admin')
def view_attendance_records(subject_id):
    conn = db.get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch students enrolled in the subject
    cursor.execute("""
            SELECT s.RFID, s.student_name, se.SubjectAttended, se.TotalDays
            FROM students s
            JOIN subjects_enrolled se ON s.RFID = se.RFID
            WHERE se.subject_id = %s
            Order by s.student_name
        """, (subject_id,))
    students = cursor.fetchall()

    # Fetch attendance records for the subject
    cursor.execute("""
            SELECT sa.RFID, sa.attendance_status, sa.date
            FROM subject_attendance sa
            WHERE sa.subject_id = %s
        """, (subject_id,))
    attendance_records = cursor.fetchall()

    cursor.close()
    conn.close()

    # Process data: Calculate attendance percentage and prepare data for display
    student_attendance = defaultdict(lambda: {'DaysAttended': 0, 'TotalDays': 0, 'AttendanceRecords': []})

    for record in attendance_records:
        student_rfid = record['RFID']
        if record['attendance_status'] == 'present':
            student_attendance[student_rfid]['DaysAttended'] += 1
        student_attendance[student_rfid]['AttendanceRecords'].append({
            'date': record['date'],
            'status': record['attendance_status']
        })
        student_attendance[student_rfid]['TotalDays'] += 1

    # Populate attendance percentage for each student
    for student in students:
        rfid = student['RFID']
        days_attended = student_attendance[rfid]['DaysAttended']
        total_days = student['TotalDays'] if student['TotalDays'] else 1  # Avoid division by zero
        attendance_percentage = (days_attended / total_days) * 100

        # Add attendance percentage to student data
        student_attendance[rfid]['AttendancePercentage'] = round(attendance_percentage, 1)
        student_attendance[rfid]['student_name'] = student['student_name']
        student_attendance[rfid]['TotalDays'] = student['TotalDays']
        student_attendance[rfid]['SubjectAttended'] = student['SubjectAttended']

    # Render the attendance records on the page
    return render_template('view_attendance_records.html', subject_id=subject_id, students=student_attendance)

# Mark subject attendance
@teacher_bp.route('/mark_subject_2attendance/<int:subject_id>', methods=['GET', 'POST'])
@auth.login_required('admin')
def mark_subject_2attendance(subject_id):
    conn = db.get_db_connection()

    if request.method == 'GET':
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT s.* 
            FROM Students s 
            JOIN Subjects_Enrolled se ON s.RFID = se.RFID
            WHERE se.subject_id = %s
            ORDER BY student_name
        """, (subject_id,))

        students = cursor.fetchall()
        cursor.close()

        # Fetch existing attendance records for the current date
        attendance_date = datetime.now().strftime('%Y-%m-%d')
        attendance_records = {}

        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT RFID, attendance_status 
            FROM Subject_Attendance 
            WHERE subject_id = %s AND date = %s
        """, (subject_id, attendance_date))

        for record in cursor.fetchall():
            attendance_records[record['RFID']] = record['attendance_status']

        cursor.close()
        conn.close()

        return render_template('mark_subject_2attendance.html', students=students, subject_id=subject_id,
                               attendance_records=attendance_records)

    attendance_date = request.form.get('attendance_date', datetime.now().strftime('%Y-%m-%d'))
    attendance_data = request.form.to_dict(flat=False)

    cursor = conn.cursor()

    for rfid in attendance_data.get('rfid', []):
        # Get the attendance status, default to 'present' if not selected
        status = request.form.get(f'attendance_{rfid}', 'present')

        # Check if attendance for this RFID and date already exists
        cursor.execute("""
            SELECT COUNT(*) 
            FROM Subject_Attendance 
            WHERE RFID = %s AND subject_id = %s AND date = %s
        """, (rfid, subject_id, attendance_date))

        record_exists = cursor.fetchone()[0]

        if record_exists > 0:
            # Update attendance record if it already exists
            cursor.execute("""
                UPDATE Subject_Attendance 
                SET attendance_status = %s, time = %s 
                WHERE RFID = %s AND subject_id = %s AND date = %s
            """, (status, datetime.now().strftime('%H:%M:%S'), rfid, subject_id, attendance_date))
        else:
            # Insert attendance record if it doesn't already exist
            cursor.execute("""
                INSERT INTO Subject_Attendance (RFID, subject_id, attendance_status, date, time)
                VALUES (%s, %s, %s, %s, %s)
            """, (rfid, subject_id, status, attendance_date, datetime.now().strftime('%H:%M:%S')))
            # Update total days attended
            cursor.execute("""
                UPDATE Subjects_Enrolled 
                SET TotalDays = TotalDays + 1, SubjectAttended = CASE WHEN %s = 'present' THEN SubjectAttended + 1 ELSE SubjectAttended END 
                WHERE RFID = %s AND subject_id = %s
            """, (status, rfid, subject_id))

    conn.commit()
    cursor.close()
    conn.close()

    return redirect(url_for('teacher_dashboard'))

# General attendance page
@teacher_bp.route('/general_attendance_page/<string:rfid>')
@auth.login_required('admin')
def general_attendance_page(rfid):
    try:
        general_attendance_data = db.fetch_data("""
            SELECT ga.RFID, s.student_name, ga.date, ga.time, ga.status
            FROM General_Attendance ga
            JOIN Students s ON ga.RFID = s.RFID
            WHERE ga.RFID = %s
        """, (rfid,))

        return render_template('general_attendance_page.html', general_attendance_data=general_attendance_data,
                               rfid=rfid)

    except mysql.connector.Error as e:
        print("MySQL Error:", e)
        return render_template('general_attendance_page.html', general_attendance_data=[], rfid=rfid)

# Mark general attendance
@teacher_bp.route('/mark_general_attendance')
@auth.login_required('admin')
def mark_general_attendance():
    return render_template('mark_general_attendance.html')

# Submit general attendance
@teacher_bp.route('/submit_general_attendance', methods=['POST'])
@auth.login_required('admin')
def submit_general_attendance():
    rfid = request.form['rfid']

    # Define the timezone for Pakistan Standard Time (PST)
    pk_timezone = pytz.timezone('Asia/Karachi')

    # Get the current time and convert it to Pakistan Standard Time
    current_time_utc = datetime.now(pytz.utc)  # Get the current UTC time
    date_time_pk = current_time_utc.astimezone(pk_timezone).strftime('%Y-%m-%d %H:%M:%S')  # Convert to PST

    if int(rfid) == 1234:
        rfid_handler.mark_absent_general_attendance(date_time_pk)
    elif int(rfid) == 2345:
        rfid_handler.mark_absent_employee_attendance(date_time_pk)
    else:
        if rfid_handler.check_employee_exists(rfid):
            date = datetime.now(pk_timezone).date()  # Ensure the date is in PST as well
            existing_check_in = rfid_handler.db.fetch_data(
                "SELECT * FROM Employee_Attendance WHERE RFID = %s AND Attendance_date = %s", (rfid, date)
            )
            if existing_check_in:
                rfid_handler.mark_employee_check_out(rfid, date_time_pk)
                return redirect(f'/employee_details/{rfid}')
            else:
                rfid_handler.mark_employee_check_in(rfid, date_time_pk)
                return redirect(f'/employee_details/{rfid}')
        else:
            rfid_handler.mark_general_attendance(rfid, date_time_pk)
            return redirect(f'/student_details/{rfid}')

    return redirect(f'/student_details/{rfid}')

# Student details
@teacher_bp.route('/student_details/<string:rfid>')
@auth.login_required('admin')
def student_details(rfid):
    try:
        # First, try to fetch student data using the provided RFID
        student_data = db.fetch_data("SELECT student_name, picture_url, fine FROM Students WHERE RFID = %s", (rfid,))

        if student_data:
            # If found, extract student name and image URL
            student_name = student_data[0][0]
            image_url = student_data[0][1]
            fine = student_data[0][2]
        else:
            # If not found, check in the Alternative_Rfid table
            alternative_result = db.fetch_data("SELECT rfid FROM Alternative_Rfid WHERE Card_Rfid = %s", (rfid,))

            if alternative_result:
                # Get the corresponding RFID from Alternative_Rfid
                alternative_rfid = alternative_result[0][0]

                # Now fetch student data using the alternative RFID
                student_data = db.fetch_data("SELECT student_name, picture_url, fine FROM Students WHERE RFID = %s",
                                             (alternative_rfid,))

                if student_data:
                    student_name = student_data[0][0]
                    image_url = student_data[0][1]
                    fine = student_data[0][2]
                else:
                    student_name = None
                    image_url = None
                    fine = None
            else:
                student_name = None
                image_url = None
                fine = None

        # Render the template with student details
        return render_template('student_details.html', student_name=student_name, image_url=image_url, rfid=rfid,
                               fine=fine)
    except mysql.connector.Error as e:
        print("MySQL Error:", e)
        return render_template('student_details.html', student_name=None, image_url=None
                                 , rfid=rfid, fine=None)

# Employee details
@teacher_bp.route('/employee_details/<string:rfid>')
@auth.login_required('admin')
def employee_details(rfid):
    try:
        # First, try to fetch employee data using the provided RFID
        employee_data = db.fetch_data("SELECT employee_name, picture_url FROM Employees WHERE RFID = %s", (rfid,))

        if employee_data:
            # If found, extract employee name and image URL
            employee_name = employee_data[0][0]
            image_url = employee_data[0][1]
        else:
            # If not found, check in the Alternative_Rfid table
            alternative_result = db.fetch_data("SELECT rfid FROM Alternative_Rfid WHERE Card_Rfid = %s", (rfid,))

            if alternative_result:
                # Get the corresponding RFID from Alternative_Rfid
                alternative_rfid = alternative_result[0][0]

                # Now fetch employee data using the alternative RFID
                employee_data = db.fetch_data("SELECT employee_name, picture_url FROM Employees WHERE RFID = %s",
                                             (alternative_rfid,))

                if employee_data:
                    employee_name = employee_data[0][0]
                    image_url = employee_data[0][1]
                else:
                    employee_name = None
                    image_url = None
            else:
                employee_name = None
                image_url = None

        # Render the template with employee details
        return render_template('employee_details.html', employee_name=employee_name, image_url=image_url, rfid=rfid)
    except mysql.connector.Error as e:
        print("MySQL Error:", e)
        return render_template('employee_details.html', employee_name=None, image_url=None, rfid=rfid)

# Update student details

@teacher_bp.route('/update_student_details', methods=['POST'])
@auth.login_required('admin')
def update_student_details():
    rfid = request.form['rfid']
    student_name = request.form['student_name']
    fine = request.form['fine']

    db.execute_query("""
        INSERT INTO Students (RFID, student_name, fine)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE student_name = VALUES(student_name), fine = VALUES(fine)
    """, (rfid, student_name, fine))

    return redirect(url_for('student_details', rfid=rfid))

# Update employee details
@teacher_bp.route('/update_employee_details', methods=['POST'])
@auth.login_required('admin')
def update_employee_details():
    rfid = request.form['rfid']
    employee_name = request.form['employee_name']

    db.execute_query("""
        INSERT INTO Employees (RFID, employee_name)
        VALUES (%s, %s)
        ON DUPLICATE KEY UPDATE employee_name = VALUES(employee_name)
    """, (rfid, employee_name))

    return redirect(url_for('employee_details', rfid=rfid))

# Update assessment marks
@teacher_bp.route('/update_assessment_marks', methods=['POST'])
@auth.login_required('admin')
def update_assessment_marks():
    assessment_id = request.form['assessment_id']
    rfid = request.form['rfid']
    marks_achieved = request.form['marks_achieved']

    db.execute_query("""
        INSERT INTO Assessments_Marks (RFID, assessment_id, marks_achieved)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE marks_achieved = VALUES(marks_achieved)
    """, (rfid, assessment_id, marks_achieved))

    return redirect(url_for('manage_assessment_marks', assessment_id=assessment_id))
