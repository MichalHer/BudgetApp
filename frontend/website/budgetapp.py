from flask import Blueprint, render_template
from flask_login import login_required, current_user
import requests
from . import bcrypt
from .models import User
import json

budgetapp = Blueprint('budgetapp', __name__)

@budgetapp.route('/dashboard', methods=['GET', 'POST'])
@login_required
def dashboard():
    return render_template('/dashboard.html', current_user=current_user)

@budgetapp.route('/accounts', methods=['GET', 'POST'])
@login_required
def accounts():
    api_url = "http://127.0.0.1:8000"
    data = {
        "username": current_user.username,
        "password": "fdfsdfsadfdsavcxd"
    }
    token = requests.post(f"{api_url}/login", data=data)
    if token.status_code == 403:
        info = "błąd logowania do bazy danych"
        return render_template('/accounts.html', current_user=current_user, info=info)
    token_json = token.json()
    headers = {"Authorization":f"{token_json['token_type']} {token_json['access_token']}"}
    accounts_list_req = requests.get(f"{api_url}/accounts", headers=headers)
    if accounts_list_req.status_code == 200:
        accounts = json.loads(accounts_list_req._content.decode())
        print(accounts)
        return render_template('/accounts.html', current_user=current_user, accounts=accounts)
    info = "Wystąpił błąd"
    return render_template('/accounts.html', current_user=current_user, info=info)

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