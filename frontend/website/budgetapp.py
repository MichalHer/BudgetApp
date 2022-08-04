from flask import Blueprint, render_template
from flask_login import login_required, current_user

budgetapp = Blueprint('budgetapp', __name__)

@budgetapp.route('/dashboard', methods=['GET', 'POST'])
@login_required
def dashboard():
    return render_template('/dashboard.html', current_user=current_user)