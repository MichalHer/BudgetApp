export async function get_categories() {
    const response = await fetch('/api_connection/categories',{method: "GET"})
    const data = await response.json(); 
    return data
}

export async function delete_category(id) {
    let auth = {'Content-Type':'application/json'};
    const response = await fetch('/api_connection/categories/' + id,{
        method:"DELETE", 
        headers:auth, 
    });
}

export async function add_category(category_name) {
    let headers = {'Content-Type':'application/json'};
    let body = JSON.stringify({name: category_name});
    const response = await fetch('/api_connection/categories',{
        method:"POST", 
        headers:headers, 
        body: body
    });
    const data = await response.json(); 
    return data
}

export async function change_category(category_name, id) {
    let headers = {'Content-Type':'application/json'};
    let json = JSON.parse("{}");
    if (category_name != "") json.name = category_name;
    let body = JSON.stringify(json);
    const response = await fetch('/api_connection/categories/' + id,{
        method:"PATCH", 
        headers:headers, 
        body: body
    });
    const data = await response.json(); 
    return data
}