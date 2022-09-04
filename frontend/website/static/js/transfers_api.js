const api_url = "http://127.0.0.1:8000";

async function login(username, password) {
    const body = new FormData();
    body.append("username", username);
    body.append("password", password);
    const response = await fetch(api_url + '/login', {method: "POST", body: body})
    const data = await response.json(); 
    return data;
}

export async function get_transfers(username) {
    const {token_type, access_token} = await login(username, 'fdfsdfsadfdsavcxd');
    var auth = {"Authorization": token_type + ' ' + access_token};
    const response = await fetch(api_url + '/transfers?year=2022&month=9',{method: "GET", headers: auth})
    const data = await response.json(); 
    return data
}

export async function delete_transfer(username, id) {
    const {token_type, access_token} = await login(username, 'fdfsdfsadfdsavcxd');
    let auth = {"Authorization": token_type + ' ' + access_token,
        'Content-Type':'application/json'};
    const response = await fetch(api_url + '/transfers/' + id,{
        method:"DELETE", 
        headers:auth
    });
    const data = await response.status; 
}

export async function add_transfer(username, from, to, date, value) {
    const {token_type, access_token} = await login(username, 'fdfsdfsadfdsavcxd');
    let headers = {"Authorization": token_type + ' ' + access_token,
        'Content-Type':'application/json'};
    let body = JSON.stringify({from_account: from,
                            to_account: to,
                            date: date,
                            value: value});
    console.log(body);
    const response = await fetch(api_url + '/transfers',{
        method:"POST", 
        headers:headers, 
        body: body
    });
    const data = await response.json(); 
}

export async function change_transfer(username, from, to, date, value, id) {
    const {token_type, access_token} = await login(username, 'fdfsdfsadfdsavcxd');
    let headers = {"Authorization": token_type + ' ' + access_token,
        'Content-Type':'application/json'};
    let body = JSON.stringify({from_account: from,
                            to_account: to,
                            date: date,
                            value: value});
    console.log(body);
    const response = await fetch(api_url + '/transfers/' + id,{
        method:"PATCH", 
        headers:headers, 
        body: body
    });
    const data = await response.json(); 
}