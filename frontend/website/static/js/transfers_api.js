export async function get_transfers() {
    const response = await fetch('/api_connection/transfers',{method: "GET"})
    const data = await response.json(); 
    return data;
}

export async function delete_transfer(id) {
    const response = await fetch('/api_connection/transfers/' + id,{
        method:"DELETE"
    });
}

export async function add_transfer(from, to, date, value) {
    let headers = {
        'Accept': 'application/json',
        'Content-Type':'application/json'
    };
    let json = JSON.stringify({from_account: from,
                to_account: to,
                date: date,
                value: value});

    const response = await fetch('/api_connection/transfers',{
        method:"POST", 
        headers:headers, 
        body: json
    });

    const data = await response.json(); 
    return data;
}

export async function change_transfer(from, to, date, value, id) {
    let json = JSON.parse('{}');
    if (from != "") json.from_account = from;
    if (to != "") json.to_account = to;
    if (date != "") json.date = date;
    if (value != "") json.value = value;
    console.log(json)
    let body = JSON.stringify(json);
    let headers = {
        'Accept': 'application/json',
        'Content-Type':'application/json'
    };
    const response = await fetch('/api_connection/transfers/' + id,{
        method:"PATCH", 
        headers:headers, 
        body: body
    });
    const data = await response.json();
    return data; 
}