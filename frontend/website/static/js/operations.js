import {get_operations, get_operation, delete_operation, add_operation, change_operation} from "./operations_api.js";
import {get_categories} from "./categories_api.js";
import {get_accounts} from "./accounts_api.js";
import {get_predictions} from "./predictions_api.js";

async function operations_table(){
    let table_html = '<thead><tr>\
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
            let prediction_name = " ";
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
    document.getElementById("remove_button").addEventListener("click", delete_opr);
    document.getElementById("confirm_btn").addEventListener("click", add_or_change_prediction);
    document.getElementById("add_button").addEventListener("click", unmark_radios);
    document.getElementById("date").addEventListener("click", load_predictions);
}

async function modal_init(){
    let accounts_sel = '<option selected>Wybierz konto</option>'
    if (accounts.length != 0){
        accounts.forEach(element => {
        accounts_sel += `<option name="acc_sel" value="${element.ID_Acc}">${element.currency} ${element.name}</option>`;
        });
    }
    document.getElementById('accounts_select').innerHTML=accounts_sel;

    let categories_sel = '<option selected>Wybierz kategorię</option>'
    if (categories.length != 0){
        categories.forEach(element => {
        categories_sel += `<option name="cat_sel" value="${element.ID_Cat}">${element.name}</option>`;
        });
    }
    document.getElementById('categories_select').innerHTML=categories_sel;
    document.getElementById("remove_button").addEventListener("click", delete_opr);
    document.getElementById("confirm_btn").addEventListener("click", add_or_change_prediction);
    document.getElementById("add_button").addEventListener("click", unmark_radios);
    document.getElementById("date").addEventListener("click", load_predictions);
}

async function load_page(){
    await operations_table();
    await modal_init();
}

async function load_predictions(){
    const category_id = document.getElementById("categories_select").value;
    const account_id = document.getElementById("accounts_select").value;
    let filtered_predictions = predictions.filter(x => x.account == account_id).filter(x => x.category == category_id)
    let predictions_sel = '<option selected>Brak</option>';
    if (filtered_predictions.length != 0) {
        filtered_predictions.forEach(element => {
            predictions_sel += `<option name="pred_sel" value="${element.ID_Pred}">${element.purpose_of_the_expendture}</option>`;
        });
    }
    document.getElementById('predictions_select').innerHTML=predictions_sel;
    document.getElementById("remove_button").addEventListener("click", delete_opr);
    document.getElementById("confirm_btn").addEventListener("click", add_or_change_prediction);
    document.getElementById("add_button").addEventListener("click", unmark_radios);
    document.getElementById("date").addEventListener("click", load_predictions);
}

async function delete_opr() {
    const user = document.getElementById("username").textContent;
    let radios = document.getElementsByName('radio_btn');
    let id = null;
    for (let i of radios){
        if (i.checked) {
            id = i.value;
        }
    }
    if (id != null){
        await delete_operation(user, id);
        operations = operations.filter(x => x.ID_Op != id);
        await operations_table();
    }
}

async function add_or_change_prediction() {
        const category_id = document.getElementById("categories_select").value;
        const account_id = document.getElementById("accounts_select").value;
        let prediction_id = document.getElementById("predictions_select").value;
        if (prediction_id == "Brak") {prediction_id = null;}
        const prediction_date = document.getElementById("date").value;
        const prediction_pote = document.getElementById("description").value;
        const prediction_value = document.getElementById("value").value;
        const user = document.getElementById("username").textContent;
        let new_operation = null;
        
        let radios = document.getElementsByName('radio_btn');
        let id = null;
        for (let i of radios){
            if (i.checked) {
                id = i.value;
            }
        }
        if (id != null){
            new_operation = await change_operation(user, category_id, account_id, prediction_id, prediction_date, prediction_pote, prediction_value, id).then(operations_table(user));
            operations = operations.filter(x => x.ID_Op != id);
            operations.push(new_operation);
            await operations_table();
        } else {
            new_operation = await add_operation(user, category_id, account_id, prediction_id, prediction_date, prediction_pote, prediction_value).then(operations_table(user));
            operations.push(new_operation);
            await operations_table();
        }
}

async function unmark_radios() {
    let radios = document.getElementsByName('radio_btn');
    for (let i of radios){
        if (i.checked) {
            i.checked = false;
        }
    }
}



document.getElementById("remove_button").addEventListener("click", delete_opr);
document.getElementById("confirm_btn").addEventListener("click", add_or_change_prediction);
document.getElementById("add_button").addEventListener("click", unmark_radios);
document.getElementById("date").addEventListener("click", load_predictions);
const user = document.getElementById("username").textContent;
let operations = await get_operations(user);
let predictions = await get_predictions(user);
let categories = await get_categories(user);
let accounts = await get_accounts(user);
window.onload = load_page();