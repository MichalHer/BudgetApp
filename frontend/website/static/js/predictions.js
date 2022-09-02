import {get_predictions, delete_prediction, add_prediction, change_prediction} from "./predictions_api.js"; //
import {get_categories} from "./categories_api.js";
import {get_accounts} from "./accounts_api.js";

async function predictions_table_for(username){
    const predictions = await get_predictions(username);
    const categories = await get_categories(username);
    const accounts = await get_accounts(username);
    var table_html = '<thead><tr>\
                    <th scope="col" width="5%"></th>\
                    <th scope="col" width="10%">ID przewidywania</th>\
                    <th scope="col">Konto</th>\
                    <th scope="col">Kategoria</th>\
                    <th scope="col">Opis</th>\
                    <th scope="col width="10%">Data</th>\
                    <th scope="col">Wartość</th>\
                    </tr></thead>';

    if (predictions.length != 0){
        table_html += "<tbody>"
        predictions.forEach(element => {
            table_html += '<tr>\
            <th scope="row">\
            <div class="form-check"><input class="form-check-input" type="radio" name="radio_btn" value="' + element.ID_Pred + '" id="radio_' + element.ID_Pred + 
            '"><label class="form-check-label" for="radio_' + element.ID_Pred + '"></label></div></th>\
            <td><a class="nav-link" href="#">' + element.ID_Pred + '</a></td>\
            <td><a class="nav-link" href="#">' + accounts.find(x => x.ID_Acc == element.account).name + '</a></td>\
            <td><a class="nav-link" href="#">' + categories.find(x => x.ID_Cat == element.category).name + '</a></td>\
            <td><a class="nav-link" href="#">' + element.purpose_of_the_expendture + '</a></td>\
            <td><a class="nav-link" href="#">' + element.date + '</a></td>\
            <td><a class="nav-link" href="#">' + element.value + '</a></td>';
        });
        table_html += '</tbody>'
    }
    document.getElementById('predictions_table').innerHTML=table_html;
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
    predictions_table_for(username);
    modal_init(username);
}

async function delete_pred() {
    const user = document.getElementById("username").textContent;
    var radios = document.getElementsByName('radio_btn');
    var id = null;
    for (let i of radios){
        if (i.checked) {
            id = i.value;
        }
    }
    if (id != null){
        delete_prediction(user, id).then(predictions_table_for(user));
    }
}

async function add_or_change_prediction() {
        const category_id = document.getElementById("categories_select").value;
        const account_id = document.getElementById("accounts_select").value;
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
            change_prediction(user, category_id, account_id, prediction_date, prediction_pote, prediction_value, id).then(predictions_table_for(user));
        } else {
            add_prediction(user, category_id, account_id, prediction_date, prediction_pote, prediction_value).then(predictions_table_for(user));
        }
}

async function unmark_radios() {
    var radios = document.getElementsByName('radio_btn');
    for (let i of radios){
        i.checked = false;
    }
}

document.getElementById("remove_button").addEventListener("click", delete_pred);
document.getElementById("confirm_btn").addEventListener("click", add_or_change_prediction);
document.getElementById("add_button").addEventListener("click", unmark_radios);
const user = document.getElementById("username").textContent;
window.onload = load_page(user)