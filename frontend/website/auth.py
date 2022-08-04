from flask import Flask, Blueprint, render_template, url_for, redirect
from flask_bcrypt import Bcrypt
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError
from flask import Flask
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from . import db, bcrypt, login_manager

auth = Blueprint('auth', __name__)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(50), nullable=False)

class RegisterForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(
        min=4, max=50)], render_kw={"placeholder":"Nazwa Użytkownika"})
    
    password = PasswordField(validators=[InputRequired(), Length(
        min=4, max=50)], render_kw={"placeholder": "Hasło"})
    
    submit = SubmitField("Zarejestruj")
    
    def validate_username(self, username):
        existing_username = User.query.filter_by(
            username=username.data).first()
        if existing_username:
            raise ValidationError("Taki użytkownik już istnieje.")
        
class LoginForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(
        min=4, max=50)], render_kw={"placeholder":"Nazwa Użytkownika"})
    
    password = PasswordField(validators=[InputRequired(), Length(
        min=4, max=50)], render_kw={"placeholder": "Hasło"})
    
    submit = SubmitField("Zaloguj")
    
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
        db.session.add(new_user)
        db.session.commit()
        print(f"registering user {new_user.username} ok.")
        return redirect(url_for('auth.login'))
    return render_template('/register.html', form=form)

@auth.route('/logout', methods=["GET", 'POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('views.index'))