from flask import Flask, Blueprint, render_template, url_for, redirect
from flask_bcrypt import Bcrypt
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user


views = Blueprint('views', __name__)

@views.route('/')
def index():
    return render_template('/index.html')