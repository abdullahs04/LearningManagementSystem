from flask import Flask
from flask_cors import CORS
from src.admin.Students import student_bp
from src.admin.Subjects import subject_bp
from src.admin.Campus import campus_bp
from src.admin.Teachers import teacher_bp
from src.Shared import shared_bp
from src.admin.Attendance import attendance_bp
from src.admin.Authentication import auth_bp
from src.Result import result_bp

from src.student.Chat import chat_bp
from src.student.queries import queries_bp
from src.admin.Announcement import announcement_bp
from src.student.Assignment import assignments_bp
from src.student.AttendanceRecords import StudentAttendance_bp
from src.student.timetable import timetable_bp
from src.student.StudentProfile import StudentProfile_bp



from src.student.Overview_Metrics import metrics_bp
from src.student.MyCourses import MyCourses_bp
import os

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'static/ProfilePictures')

# Register Blueprints
app.register_blueprint(student_bp, url_prefix='/student')
app.register_blueprint(subject_bp, url_prefix='/subject')
app.register_blueprint(campus_bp, url_prefix='/campus')
app.register_blueprint(teacher_bp, url_prefix='/teacher')
app.register_blueprint(shared_bp, url_prefix='/shared')
app.register_blueprint(attendance_bp, url_prefix='/attendance')
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(result_bp, url_prefix='/result')
app.register_blueprint(announcement_bp, url_prefix='/announcement')
app.register_blueprint(chat_bp, url_prefix='/chat')
app.register_blueprint(queries_bp, url_prefix='/queries')
app.register_blueprint(assignments_bp, url_prefix='/assignments')

app.register_blueprint(MyCourses_bp, url_prefix='/MyCourses')
app.register_blueprint(metrics_bp,url_prefix='/metrics')
app.register_blueprint(StudentAttendance_bp,url_prefix='/StudentAttendance')
app.register_blueprint(timetable_bp,url_prefix="/timetable")
app.register_blueprint(StudentProfile_bp,url_prefix="/StudentProfile")


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=10000, debug=True)
