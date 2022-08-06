from flask import Blueprint, render_template
from flask_login import login_required, current_user

budgetapp = Blueprint('budgetapp', __name__)

@budgetapp.route('/dashboard', methods=['GET', 'POST'])
@login_required
def dashboard():
    return render_template('/dashboard.html', current_user=current_user)

@budgetapp.route('/accounts', methods=['GET', 'POST'])
@login_required
def accounts():
    return render_template('/accounts.html', current_user=current_user)

@budgetapp.route('/categories', methods=['GET', 'POST'])
@login_required
def categories():
    return render_template('/categories.html', current_user=current_user)

@budgetapp.route('/operations', methods=['GET', 'POST'])
@login_required
def operations():
    return render_template('/operations.html', current_user=current_user)

@budgetapp.route('/predictions', methods=['GET', 'POST'])
@login_required
def predictions():
    return render_template('/predictions.html', current_user=current_user)

@budgetapp.route('/transfers', methods=['GET', 'POST'])
@login_required
def transfers():
    return render_template('/transfers.html', current_user=current_user)