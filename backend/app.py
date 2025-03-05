from flask import Flask,render_template, request
from src.auth import auth_bp
from src.students import student_bp
from src.assessment import assessment_bp
from src.subject import subject_bp
from src.admin import admin_bp
from src.auth import Auth
auth = Auth()

app = Flask(__name__)
app.secret_key = 'TRY/One12'

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(student_bp, url_prefix='/student')
app.register_blueprint(assessment_bp, url_prefix='/assessment')
app.register_blueprint(subject_bp, url_prefix='/subject')
app.register_blueprint(admin_bp, url_prefix='/admin')
app.config['UPLOAD_FOLDER'] = 'static/uploads'


@app.route('/', methods=['GET', 'POST'])
@auth.login_required('admin')
def index():
    if request.method == 'POST':
        return "Form submitted!", 200
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
