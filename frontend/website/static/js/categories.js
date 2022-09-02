import {get_categories, delete_category, add_category, change_category} from "./categories_api.js";

async function categories_table_for(username){
    const accounts = await get_categories(username);
    var table_html = '<thead><tr><th scope="col" width="5%"></th><th scope="col" width="10%">id kategorii</th><th scope="col">Nazwa kategorii</th></tr></thead><tbody>'
    if (accounts.length != 0){
        accounts.forEach(element => {
            table_html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="radio_btn" value="' + element.ID_Cat + '" id="radio_' + element.ID_Cat + 
            '"><label class="form-check-label" for="radio_' + element.ID_Cat + '"></label></div></th><td><a class="nav-link" href="#">' + element.ID_Cat + 
            '</a></td><td><a class="nav-link" href="#">' + element.name + '</a></td>'
        });
    }
    table_html += '</tbody>'
    console.log(table_html);
    document.getElementById('categories_table').innerHTML=table_html;
}

async function delete_cat() {
    const user = document.getElementById("username").textContent;
    var radios = document.getElementsByName('radio_btn');
    var id = null;
    for (let i of radios){
        if (i.checked) {
            id = i.value;
        }
    }
    if (id != null){
        delete_category(user, id);
        categories_table_for(user);
    }
}

async function add_or_change_cat() {
    const category_name = document.getElementById("category_name").value;
    if (category_name != '' && category_name != null) {
        const user = document.getElementById("username").textContent;
        var radios = document.getElementsByName('radio_btn');
        var id = null;
        for (let i of radios){
            if (i.checked) {
                id = i.value;
            }
        }
        if (id != null){
            change_category(user, category_name, id);
        } else {
            add_category(user, category_name);
        }
    }
    categories_table_for(user);
}

async function unmark_radios() {
    var radios = document.getElementsByName('radio_btn');
    for (let i of radios){
        i.checked = false;
    }
}

document.getElementById("remove_button").addEventListener("click", delete_cat);
document.getElementById("confirm_btn").addEventListener("click", add_or_change_cat);
document.getElementById("add_button").addEventListener("click", unmark_radios);
const user = document.getElementById("username").textContent;
window.onload = categories_table_for(user);

