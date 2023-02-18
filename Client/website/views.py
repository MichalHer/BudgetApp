from flask import Blueprint, render_template, redirect, url_for

views = Blueprint('views', __name__)

@views.route('/')
def index():
    return redirect(url_for('auth.login'))