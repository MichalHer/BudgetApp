const api_url = "http://127.0.0.1:8000";

async function login(username, password) {
    const body = new FormData();
    body.append("username", username);
    body.append("password", password);
    const response = await fetch(api_url + '/login', {method: "POST", body: body})
    const data = await response.json(); 
    return data;
}

export async function get_operations(username) {
    const {token_type, access_token} = await login(username, 'fdfsdfsadfdsavcxd');
    var auth = {"Authorization": token_type + ' ' + access_token};
    const response = await fetch(api_url + '/operations',{method: "GET", headers: auth})
    const data = await response.json(); 
    return data
}

export async function get_operation(username, id) {
    const {token_type, access_token} = await login(username, 'fdfsdfsadfdsavcxd');
    var auth = {"Authorization": token_type + ' ' + access_token};
    const response = await fetch(api_url + '/operations/' + id,{method: "GET", headers: auth})
    const data = await response.json(); 
    return data
}

export async function delete_operation(username, id) {
    const {token_type, access_token} = await login(username, 'fdfsdfsadfdsavcxd');
    let auth = {"Authorization": token_type + ' ' + access_token,
        'Content-Type':'application/json'};
    const response = await fetch(api_url + '/operations/' + id,{
        method:"DELETE", 
        headers:auth, 
    }).then();
    const data = await response.status;
    return data
}

export async function add_operation(username, category_id, account_id, prediction_id, operation_date, prediction_pote, prediction_value) {
    const {token_type, access_token} = await login(username, 'fdfsdfsadfdsavcxd');
    let headers = {"Authorization": token_type + ' ' + access_token,
        'Content-Type':'application/json'};
    let body = JSON.stringify({category: category_id,
                                account: account_id,
                                prediction: prediction_id,
                                date: operation_date,
                                purpose_of_the_expendture: prediction_pote,
                                value: prediction_value});
    console.log(body);
    const response = await fetch(api_url + '/operations',{
        method:"POST", 
        headers:headers, 
        body: body
    });
    const data = await response.json();
    return data
}

export async function change_operation(username, category_id, account_id, prediction_id, operation_date, prediction_pote, prediction_value, id) {
    const {token_type, access_token} = await login(username, 'fdfsdfsadfdsavcxd');
    let headers = {"Authorization": token_type + ' ' + access_token,
        'Content-Type':'application/json'};
        let body = JSON.stringify({category: category_id,
                                    account: account_id,
                                    prediction: prediction_id,
                                    date: operation_date,
                                    purpose_of_the_expendture: prediction_pote,
                                    value: prediction_value});
    console.log(body);
    const response = await fetch(api_url + '/operations/' + id,{
        method:"PATCH", 
        headers:headers, 
        body: body
    });
    const data = await response.json(); 
    return data
}