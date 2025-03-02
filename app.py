from flask import Flask,render_template, request
from auth import auth_bp  # Import only the Blueprint
from students import student_bp  # Import the Blueprint
from database import Database
from auth import Auth
auth = Auth()

app = Flask(__name__)
app.secret_key = 'TRY/One12'

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(student_bp, url_prefix='/student')





@app.route('/', methods=['GET', 'POST'])
@auth.login_required('admin')
def index():
    if request.method == 'POST':
        return "Form submitted!", 200
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
