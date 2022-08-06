from flask import Blueprint, render_template, url_for, redirect
from flask_login import login_user, login_required, logout_user
from . import db, bcrypt, login_manager
from .models import User
from .forms import LoginForm, RegisterForm
import requests

auth = Blueprint('auth', __name__)
    
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@auth.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            if bcrypt.check_password_hash(user.password, form.password.data):
                login_user(user)
                return redirect(url_for('budgetapp.dashboard'))
    return render_template('/login.html', form=form)

@auth.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data)
        new_user = User(username=form.username.data, password=hashed_password)
        api_json = {
            "nick": f"{new_user.username}",
            "password": "fdfsdfsadfdsavcxd"
        }
        r = requests.post("http://127.0.0.1:8000/users", json=api_json,)
        if r.status_code == 201:
            db.session.add(new_user)
            db.session.commit()
            return redirect(url_for('auth.login'))
        else:
            info = "Nie udało się utworzyć konta, spróbuj później"
            return render_template('/register.html', form=form, info=info)
    return render_template('/register.html', form=form)

@auth.route('/logout', methods=["GET", 'POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('views.index'))