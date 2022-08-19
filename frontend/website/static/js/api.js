const api_url = "http://127.0.0.1:8000";

async function login(username, password) {
    const body = new FormData();
    body.append("username", username);
    body.append("password", password);
    const response = await fetch(api_url + '/login', {method: "POST", body: body})
    const data = await response.json(); 
    return data;
}

export async function get_accounts(username) {
    const {token_type, access_token} = await login(username, 'fdfsdfsadfdsavcxd');
    var auth = {"Authorization": token_type + ' ' + access_token};
    const response = await fetch(api_url + '/accounts',{method: "GET", headers: auth})
    const data = await response.json(); 
    return data
}

export async function delete_account(username, id) {
    const {token_type, access_token} = await login(username, 'fdfsdfsadfdsavcxd');
    let auth = {"Authorization": token_type + ' ' + access_token,
        'Content-Type':'application/json'};
    let body = JSON.stringify({nick: username});
    console.log(body);
    const response = await fetch(api_url + '/accounts/detach_user_from/' + id,{
        method:"DELETE", 
        headers:auth, 
        body: body
    });
    const data = await response.json(); 
}

export async function add_account(username, account_name) {
    const {token_type, access_token} = await login(username, 'fdfsdfsadfdsavcxd');
    let headers = {"Authorization": token_type + ' ' + access_token,
        'Content-Type':'application/json'};
    let body = JSON.stringify({name: account_name});
    console.log(body);
    const response = await fetch(api_url + '/accounts',{
        method:"POST", 
        headers:headers, 
        body: body
    });
    const data = await response.json(); 
}

export async function change_account_name(username, account_name, id) {
    const {token_type, access_token} = await login(username, 'fdfsdfsadfdsavcxd');
    let headers = {"Authorization": token_type + ' ' + access_token,
        'Content-Type':'application/json'};
    let body = JSON.stringify({name: account_name});
    console.log(body);
    const response = await fetch(api_url + '/accounts/' + id,{
        method:"PUT", 
        headers:headers, 
        body: body
    });
    const data = await response.json(); 
}