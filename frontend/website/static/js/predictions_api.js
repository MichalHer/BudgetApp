const api_url = "http://127.0.0.1:8000";

async function login(username, password) {
    const body = new FormData();
    body.append("username", username);
    body.append("password", password);
    const response = await fetch(api_url + '/login', {method: "POST", body: body})
    const data = await response.json(); 
    return data;
}

export async function get_predictions(username) {
    const {token_type, access_token} = await login(username, apikey);
    let auth = {"Authorization": token_type + ' ' + access_token};
    const response = await fetch(api_url + '/predictions',{method: "GET", headers: auth})
    const data = await response.json(); 
    return data
}

export async function delete_prediction(username, id) {
    const {token_type, access_token} = await login(username, apikey);
    let auth = {"Authorization": token_type + ' ' + access_token,
        'Content-Type':'application/json'};
    const response = await fetch(api_url + '/predictions/' + id,{
        method:"DELETE", 
        headers:auth, 
    });
}

export async function add_prediction(username, category_id, account_id, prediction_date, prediction_pote, prediction_value) {
    const {token_type, access_token} = await login(username, apikey);
    let headers = {"Authorization": token_type + ' ' + access_token,
        'Content-Type':'application/json'};
    let body = JSON.stringify({category: category_id,
                                account: account_id,
                                date: prediction_date,
                                purpose_of_the_expendture: prediction_pote,
                                value: prediction_value});
    console.log(body);
    const response = await fetch(api_url + '/predictions',{
        method:"POST", 
        headers:headers, 
        body: body
    });
    const data = await response.json();
    return data
}

export async function change_prediction(username, category_id, account_id, prediction_date, prediction_pote, prediction_value, id) {
    const {token_type, access_token} = await login(username, apikey);
    let headers = {"Authorization": token_type + ' ' + access_token,
        'Content-Type':'application/json'};
        let body = JSON.stringify({category: category_id,
                                    account: account_id,
                                    date: prediction_date,
                                    purpose_of_the_expendture: prediction_pote,
                                    value: prediction_value});
    console.log(body);
    const response = await fetch(api_url + '/predictions/' + id,{
        method:"PATCH", 
        headers:headers, 
        body: body
    });
    const data = await response.json(); 
    return data
}
let apikey = document.getElementById('apikey').textContent;