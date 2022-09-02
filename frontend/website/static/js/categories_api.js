const api_url = "http://127.0.0.1:8000";

async function login(username, password) {
    const body = new FormData();
    body.append("username", username);
    body.append("password", password);
    const response = await fetch(api_url + '/login', {method: "POST", body: body})
    const data = await response.json(); 
    return data;
}

export async function get_categories(username) {
    const {token_type, access_token} = await login(username, 'fdfsdfsadfdsavcxd');
    var auth = {"Authorization": token_type + ' ' + access_token};
    const response = await fetch(api_url + '/categories',{method: "GET", headers: auth})
    const data = await response.json(); 
    return data
}

export async function delete_category(username, id) {
    const {token_type, access_token} = await login(username, 'fdfsdfsadfdsavcxd');
    let auth = {"Authorization": token_type + ' ' + access_token,
        'Content-Type':'application/json'};
    let body = JSON.stringify({nick: username});
    console.log(body);
    const response = await fetch(api_url + '/categories/' + id,{
        method:"DELETE", 
        headers:auth, 
        body: body
    });
    // const data = await response.json(); 
    // return data
}

export async function add_category(username, category_name) {
    const {token_type, access_token} = await login(username, 'fdfsdfsadfdsavcxd');
    let headers = {"Authorization": token_type + ' ' + access_token,
        'Content-Type':'application/json'};
    let body = JSON.stringify({name: category_name});
    console.log(body);
    const response = await fetch(api_url + '/categories',{
        method:"POST", 
        headers:headers, 
        body: body
    });
    const data = await response.json(); 
    return data
}

export async function change_category(username, category_name, id) {
    const {token_type, access_token} = await login(username, 'fdfsdfsadfdsavcxd');
    let headers = {"Authorization": token_type + ' ' + access_token,
        'Content-Type':'application/json'};
    let body = JSON.stringify({name: category_name});
    console.log(body);
    const response = await fetch(api_url + '/categories/' + id,{
        method:"PATCH", 
        headers:headers, 
        body: body
    });
    const data = await response.json(); 
    return data
}