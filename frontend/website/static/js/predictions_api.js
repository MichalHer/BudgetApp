const api_url = "http://192.168.1.2:8000";

async function login(username, password) {
    const body = new FormData();
    body.append("username", username);
    body.append("password", password);
    const response = await fetch(api_url + '/login', {method: "POST", body: body})
    const data = await response.json(); 
    return data;
}

export async function get_predictions() {
    const response = await fetch('/api_connection/predictions',{method: "GET"})
    const data = await response.json(); 
    return data
}

export async function delete_prediction(id) {
    let auth = {'Content-Type':'application/json'};
    await fetch('/api_connection/predictions/' + id,{
        method:"DELETE", 
        headers:auth, 
    });
}

export async function add_prediction(category_id, account_id, prediction_date, prediction_pote, prediction_value) {
    let headers = {'Content-Type':'application/json'};
    let body = JSON.stringify({category: category_id,
                                account: account_id,
                                date: prediction_date,
                                purpose_of_the_expendture: prediction_pote,
                                value: prediction_value});
    const response = await fetch('/api_connection/predictions',{
        method:"POST", 
        headers:headers, 
        body: body
    });
    const data = await response.json();
    return data
}

export async function change_prediction(category_id, account_id, prediction_date, prediction_pote, prediction_value, id) {
    let headers = {'Content-Type':'application/json'};
    let json = JSON.parse("{}")
    if(category_id != "") json.category = category_id;
    if(account_id != "") json.account = account_id;
    if(prediction_date != "") json.date = prediction_date;
    if(prediction_pote != "") json.purpose_of_the_expendture = prediction_pote;
    if(prediction_value != "") json.value = prediction_value;
    let body = JSON.stringify(json);
    const response = await fetch('/api_connection/predictions/' + id,{
        method:"PATCH", 
        headers:headers, 
        body: body
    });
    const data = await response.json(); 
    return data
}