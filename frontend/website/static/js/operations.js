import {get_operations, get_operation, delete_operation, add_operation, change_operation} from "./operations_api.js";
import {get_categories} from "./categories_api.js";
import {get_accounts} from "./accounts_api.js";
import {get_predictions} from "./predictions_api.js";

async function operations_table_for(username){
    const operations = await get_operations(username);
    const predictions = await get_predictions(username);
    const categories = await get_categories(username);
    const accounts = await get_accounts(username);
    var table_html = '<thead><tr>\
                    <th scope="col" width="5%"></th>\
                    <th scope="col" width="10%">ID operacji</th>\
                    <th scope="col">Konto</th>\
                    <th scope="col">Kategoria</th>\
                    <th scope="col">Przewidywanie</th>\
                    <th scope="col">Opis</th>\
                    <th scope="col width="10%">Data</th>\
                    <th scope="col">Wartość</th>\
                    </tr></thead>';

    if (operations.length != 0){
        table_html += "<tbody>"
        operations.forEach(element => {
            var prediction_name = " ";
            if (element.prediction != null) {
                prediction_name = predictions.find(x => x.ID_Pred == element.prediction).purpose_of_the_expendture;
            } 
            table_html += '<tr>\
            <th scope="row">\
            <div class="form-check"><input class="form-check-input" type="radio" name="radio_btn" value="' + element.ID_Op + '" id="radio_' + element.ID_Op + 
            '"><label class="form-check-label" for="radio_' + element.ID_Op + '"></label></div></th>\
            <td><a class="nav-link" href="#">' + element.ID_Op + '</a></td>\
            <td><a class="nav-link" href="#">' + accounts.find(x => x.ID_Acc == element.account).name + '</a></td>\
            <td><a class="nav-link" href="#">' + categories.find(x => x.ID_Cat == element.category).name + '</a></td>\
            <td><a class="nav-link" href="#">' + prediction_name + '</a></td>\
            <td><a class="nav-link" href="#">' + element.purpose_of_the_expendture + '</a></td>\
            <td><a class="nav-link" href="#">' + element.date + '</a></td>\
            <td><a class="nav-link" href="#">' + element.value + '</a></td>';
        });
        table_html += '</tbody>'
    }
    document.getElementById('operations_table').innerHTML=table_html;
}

async function modal_init(username){
    const categories = await get_categories(username);
    const accounts = await get_accounts(username);
    var accounts_sel = '<option selected>Wybierz konto</option>'
    if (accounts.length != 0){
        accounts.forEach(element => {
        accounts_sel += `<option name="acc_sel" value="${element.ID_Acc}">${element.currency} ${element.name}</option>`;
        });
    }
    document.getElementById('accounts_select').innerHTML=accounts_sel;

    var categories_sel = '<option selected>Wybierz kategorię</option>'
    if (categories.length != 0){
        categories.forEach(element => {
        categories_sel += `<option name="cat_sel" value="${element.ID_Cat}">${element.name}</option>`;
        });
    }
    document.getElementById('categories_select').innerHTML=categories_sel;
}

async function load_page(username){
    operations_table_for(username);
    modal_init(username);
}

async function load_predictions(){
    const user = document.getElementById("username").textContent;
    const category_id = document.getElementById("categories_select").value;
    const account_id = document.getElementById("accounts_select").value;
    var predictions = await get_predictions(user)
    var filtered_predictions = predictions.filter(x => x.account == account_id).filter(x => x.category == category_id)
    var predictions_sel = '<option selected>Brak</option>';
    if (filtered_predictions.length != 0) {
        filtered_predictions.forEach(element => {
            predictions_sel += `<option name="pred_sel" value="${element.ID_Pred}">${element.purpose_of_the_expendture}</option>`;
        });
    }
    document.getElementById('predictions_select').innerHTML=predictions_sel;
}

async function delete_opr() {
    const user = document.getElementById("username").textContent;
    var radios = document.getElementsByName('radio_btn');
    var id = null;
    for (let i of radios){
        if (i.checked) {
            id = i.value;
        }
    }
    if (id != null){
        delete_operation(user, id).then(operations_table_for(user));
    }
}

async function add_or_change_prediction() {
        const category_id = document.getElementById("categories_select").value;
        const account_id = document.getElementById("accounts_select").value;
        var prediction_id = document.getElementById("predictions_select").value;
        if (prediction_id == "Brak") {prediction_id = null;}
        const prediction_date = document.getElementById("date").value;
        const prediction_pote = document.getElementById("description").value;
        const prediction_value = document.getElementById("value").value;
        const user = document.getElementById("username").textContent;
        
        var radios = document.getElementsByName('radio_btn');
        var id = null;
        for (let i of radios){
            if (i.checked) {
                id = i.value;
            }
        }
        if (id != null){
            change_operation(user, category_id, account_id, prediction_id, prediction_date, prediction_pote, prediction_value, id).then(operations_table_for(user));
        } else {
            add_operation(user, category_id, account_id, prediction_id, prediction_date, prediction_pote, prediction_value).then(operations_table_for(user));
        }
}

async function unmark_radios() {
    var radios = document.getElementsByName('radio_btn');
    for (let i of radios){
        if (i.checked) {
            i.checked = false;
        }
    }
}

async function load_marked(user){
    var radios = document.getElementsByName('radio_btn');
    for (let i of radios){
        const operation_data = get_operation(user, i.value);
    }
}


document.getElementById("remove_button").addEventListener("click", delete_opr);
document.getElementById("confirm_btn").addEventListener("click", add_or_change_prediction);
document.getElementById("add_button").addEventListener("click", unmark_radios);
document.getElementById("date").addEventListener("click", load_predictions)
const user = document.getElementById("username").textContent;
window.onload = load_page(user)