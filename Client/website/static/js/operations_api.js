export async function get_operations() {
    const response = await fetch('/api_connection/operations',{method: "GET"})
    const data = await response.json(); 
    return data
}

export async function delete_operation(id) {
    let header = {'Content-Type':'application/json'};
    const response = await fetch('/api_connection/operations/' + id,{
        method:"DELETE", 
        headers:header, 
    });
}

export async function add_operation(category_id, account_id, prediction_id, operation_date, prediction_pote, prediction_value) {
    let headers = {'Content-Type':'application/json'};
    let body = JSON.stringify({category: category_id,
                                account: account_id,
                                prediction: prediction_id,
                                date: operation_date,
                                purpose_of_the_expendture: prediction_pote,
                                value: prediction_value});
    const response = await fetch('/api_connection/operations',{
        method:"POST", 
        headers:headers, 
        body: body
    });
    const data = await response.json();
    return data
}

export async function change_operation(category_id, account_id, prediction_id, operation_date, prediction_pote, prediction_value, id) {
    let headers = {'Content-Type':'application/json'};
    let json = JSON.parse("{}")
    if(category_id != "") json.category = category_id
    if(account_id != "") json.account = account_id
    if(prediction_id != "") json.prediction = prediction_id
    if(operation_date != "") json.date = operation_date
    if(prediction_pote != "") json.purpose_of_the_expendture = prediction_pote
    if(prediction_value != "") json.value = prediction_value
    let body = JSON.stringify(json);
    console.log(body);
    const response = await fetch('/api_connection/operations/' + id,{
        method:"PATCH", 
        headers:headers, 
        body: body
    });
    const data = await response.json(); 
    return data
}