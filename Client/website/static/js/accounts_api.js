export async function get_accounts() {
    const response = await fetch('/api_connection/accounts',{method: "GET"})
    const data = await response.json(); 
    return data;
}

export async function delete_account(id) {
    let headers = {'Content-Type':'application/json'};
    const response = await fetch('/api_connection/accounts/' + id,{
        method:"DELETE", 
        headers:headers, 
    });
}

export async function add_account(account_name, acc_currency) {
    let headers = {'Content-Type':'application/json'};
    let body = JSON.stringify({name: account_name, currency: acc_currency});
    const response = await fetch('/api_connection/accounts',{
        method:"POST",
        headers:headers,
        body: body
    });
    const data = await response.json();
    return data;
}

export async function change_account(account_name, id, acc_currency) {
    let headers = {'Content-Type':'application/json'};
    let json = JSON.parse("{}");
    if (account_name != "") json.name = account_name;
    if (acc_currency != "") json.currency = acc_currency;
    let body = JSON.stringify(json);
    const response = await fetch('/api_connection/accounts/' + id,{
        method:"PATCH", 
        headers:headers, 
        body: body
    });
    const data = await response.json(); 
    return data;
}