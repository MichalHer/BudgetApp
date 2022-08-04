from flask import Flask, Blueprint, render_template, url_for, redirect
from flask_bcrypt import Bcrypt
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from . import login_manager

budgetapp = Blueprint('budgetapp', __name__)

@budgetapp.route('/dashboard', methods=['GET', 'POST'])
@login_required
def dashboard():
    return render_template('/dashboard.html', current_user=current_user)