from flask import Flask, Blueprint, request, Response
from flask_login import login_required, current_user
from .config import API_URL
import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder
import json


def get_token(username: str, apikey: str) -> json:
    '''
    API login function
    '''
    form_params = {
        'username': username,
        'password': apikey
    }
    form = MultipartEncoder(fields=form_params)
    headers = {
        'Content-type': form.content_type
    }
    r = requests.post(
        f'{API_URL}/login',
        data = form,
        headers = headers
    )
    return r.json()

api_connection = Blueprint('/api_connection', __name__)

#############################
# Transfers methods
#############################
@api_connection.route('/transfers', methods=['GET', 'POST'])
@login_required
def api_get_post_transfers():
    bearer_token = get_token(current_user.username, current_user.apikey)
    header = {'Authorization': f"{bearer_token['token_type']} {bearer_token['access_token']}"}
    if request.method == 'GET':
        r = requests.get(f'{API_URL}/transfers', headers=header)
        return r.json()
        
    if request.method == 'POST':
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            content = request.json
            header['Content-Type'] = 'application/json'
            r = requests.post(f'{API_URL}/transfers', headers=header, json=content)
            return r.json()
        else:
            print('nie ok')
            return 'Content-Type not supported!'
        
@api_connection.route('/transfers/<id>', methods=['DELETE', 'PATCH'])
@login_required
def api_del_patch_transfers(id:int):
    print(request.method)
    bearer_token = get_token(current_user.username, current_user.apikey)
    header = {'Authorization': f"{bearer_token['token_type']} {bearer_token['access_token']}"}
    if request.method == 'DELETE': 
        r = requests.delete(f'{API_URL}/transfers/{id}', headers=header)
        return Response(status=r.status_code)
    
    if request.method == 'PATCH': 
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            content = request.json
            header['Content-Type'] = 'application/json'
            r = requests.patch(f'{API_URL}/transfers/{id}', headers=header, json=content)
            return r.json()
        else:
            print('nie ok')
            return 'Content-Type not supported!'

#############################
# Predictions methods
#############################
@api_connection.route('/predictions', methods=['GET', 'POST'])
@login_required
def api_get_post_predictions():
    bearer_token = get_token(current_user.username, current_user.apikey)
    header = {'Authorization': f"{bearer_token['token_type']} {bearer_token['access_token']}"}
    if request.method == 'GET':
        r = requests.get(f'{API_URL}/predictions', headers=header)
        if r.status_code == 200:
            return r.json()
        else:
            return 'Something goes wrong!'
    
    if request.method == 'POST':
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            content = request.json
            header['Content-Type'] = 'application/json'
            r = requests.post(f'{API_URL}/predictions', headers=header, json=content)
            if r.status_code == 201:
                return r.json()
            else:
                return 'Something goes wrong!'
        else:
            print('nie ok')
            return 'Content-Type not supported!'

@api_connection.route('/predictions/<id>', methods=['DELETE', 'PATCH'])
@login_required
def api_delete_patch_predictions(id: int):
    bearer_token = get_token(current_user.username, current_user.apikey)
    header = {'Authorization': f"{bearer_token['token_type']} {bearer_token['access_token']}"}
    
    if request.method == 'DELETE':
        r = requests.delete(f'{API_URL}/predictions/{id}', headers=header)
        return Response(status=r.status_code)
        
    if request.method == 'PATCH':
        content_type = request.headers.get('Content-Type')
        if (content_type == 'application/json'):
            content = request.json
            header['Content-Type'] = 'application/json'
            r = requests.patch(f'{API_URL}/predictions/{id}', headers=header, json=content)
            return r.json()
        else:
            print('nie ok')
            return 'Content-Type not supported!'