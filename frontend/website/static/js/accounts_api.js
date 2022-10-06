const api_url = "http://192.168.1.2:8000";

async function login(username, password) {
    const body = new FormData();
    body.append("username", username);
    body.append("password", password);
    const response = await fetch(api_url + '/login', {method: "POST", body: body})
    const data = await response.json(); 
    return data;
}

export async function get_accounts(username) {
    const {token_type, access_token} = await login(username, apikey);
    let auth = {"Authorization": token_type + ' ' + access_token};
    const response = await fetch(api_url + '/accounts',{method: "GET", headers: auth})
    const data = await response.json(); 
    return data;
}

export async function delete_account(username, id) {
    const {token_type, access_token} = await login(username, apikey);
    let auth = {"Authorization": token_type + ' ' + access_token,
        'Content-Type':'application/json'};
    let body = JSON.stringify({nick: username});
    const response = await fetch(api_url + '/accounts/detach_user_from/' + id,{
        method:"DELETE", 
        headers:auth, 
        body: body
    });
}

export async function add_account(username, account_name, acc_currency) {
    const {token_type, access_token} = await login(username, apikey);
    let headers = {"Authorization": token_type + ' ' + access_token,
        'Content-Type':'application/json'};
    let body = JSON.stringify({name: account_name, currency: acc_currency});
    const response = await fetch(api_url + '/accounts',{
        method:"POST", 
        headers:headers, 
        body: body
    });
    const data = await response.json(); 
    return data;
}

export async function change_account(username, account_name, id, acc_currency) {
    const {token_type, access_token} = await login(username, apikey);
    let headers = {"Authorization": token_type + ' ' + access_token,
        'Content-Type':'application/json'};
    let body = JSON.stringify({name: account_name, currency: acc_currency});
    const response = await fetch(api_url + '/accounts/' + id,{
        method:"PUT", 
        headers:headers, 
        body: body
    });
    const data = await response.json(); 
    return data;
}
let apikey = document.getElementById('apikey').textContent;