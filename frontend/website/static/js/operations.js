import {get_operations, delete_operation, add_operation, change_operation} from "./operations_api.js";
import {get_categories} from "./categories_api.js";
import {get_accounts} from "./accounts_api.js";
import {get_predictions} from "./predictions_api.js";

async function operations_table(operations){
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
    document.getElementById("date").addEventListener("change", load_predictions);
    document.getElementById("categories_select").addEventListener("change", load_predictions);
}

async function modal_init(){
    let accounts_sel = '<option selected></option>'
    if (accounts.length != 0){
        accounts.forEach(element => {
        accounts_sel += `<option name="acc_sel" value="${element.ID_Acc}">${element.currency} ${element.name}</option>`;
        });
    }
    document.getElementById('accounts_select').innerHTML=accounts_sel;

    let categories_sel = '<option selected></option>'
    if (categories.length != 0){
        categories.forEach(element => {
        categories_sel += `<option name="cat_sel" value="${element.ID_Cat}">${element.name}</option>`;
        });
    }
    document.getElementById('categories_select').innerHTML=categories_sel;
    document.getElementById("remove_button").addEventListener("click", delete_opr);
    document.getElementById("confirm_btn").addEventListener("click", add_or_change_prediction);
    document.getElementById("add_button").addEventListener("click", unmark_radios);
    document.getElementById("date").addEventListener("change", load_predictions);
    document.getElementById("categories_select").addEventListener("change", load_predictions);
}

async function load_page(){
    await operations_table(operations);
    await modal_init();
}

async function load_predictions(){
    let date = new Date(Date.parse(document.getElementById("date").value));
    let month = date.getMonth()+1;
    let year = date.getFullYear()
    const category_id = document.getElementById("categories_select").value;
    const account_id = document.getElementById("accounts_select").value;
    let filtered_predictions = predictions.filter(x => x.category == category_id).filter(
        x => new Date(Date.parse(x.date)).getMonth()+1 == month).filter(
            x => new Date(Date.parse(x.date)).getFullYear() == year);
    let predictions_sel = '<option selected></option>';
    if (filtered_predictions.length != 0) {
        filtered_predictions.forEach(element => {
            predictions_sel += `<option name="pred_sel" value="${element.ID_Pred}">${element.purpose_of_the_expendture}</option>`;
        });
    }
    document.getElementById('predictions_select').innerHTML=predictions_sel;
    document.getElementById("remove_button").addEventListener("click", delete_opr);
    document.getElementById("confirm_btn").addEventListener("click", add_or_change_prediction);
    document.getElementById("add_button").addEventListener("click", unmark_radios);
    document.getElementById("date").addEventListener("change", load_predictions);
    document.getElementById("categories_select").addEventListener("change", load_predictions);
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
        await delete_operation(id);
        operations = operations.filter(x => x.ID_Op != id);
        if (document.getElementById("month").value == 0 && document.getElementById("year").value == ""){
            await operations_table(operations);
        } else {
            await filter();
        }
    }
}

async function add_or_change_prediction() {
        const category_id = document.getElementById("categories_select").value;
        const account_id = document.getElementById("accounts_select").value;
        let prediction_id = document.getElementById("predictions_select").value;
        if (prediction_id == "") {prediction_id = null;}
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
            new_operation = await change_operation(category_id, account_id, prediction_id, prediction_date, prediction_pote, prediction_value, id).then(operations_table(user));
            operations = operations.filter(x => x.ID_Op != id);
            operations.push(new_operation);
            if (document.getElementById("month").value == 0 && document.getElementById("year").value == ""){
                await operations_table(operations);
            } else {
                await filter();
            }
        } else {
            new_operation = await add_operation(category_id, account_id, prediction_id, prediction_date, prediction_pote, prediction_value).then(operations_table(user));
            operations.push(new_operation);
            if (document.getElementById("month").value == 0 && document.getElementById("year").value == ""){
                await operations_table(operations);
            } else {
                await filter();
            }
        }
}

function last_day_of_month(year, month){
    return new Date(year, month, 0).getDate();
}

async function filter(){
    let year = document.getElementById("year").value;
    let month = document.getElementById("month").value;
    let date_from = Date.parse(`${year}-${month}-01`);
    let date_to = Date.parse(`${year}-${month}-${last_day_of_month(year,month)}`);
    let filtered_operations = operations.filter(x => Date.parse(x.date) >= date_from && Date.parse(x.date) <= date_to);
    await operations_table(filtered_operations);
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
document.getElementById("date").addEventListener("change", load_predictions);
document.getElementById("categories_select").addEventListener("change", load_predictions);
document.getElementById("filter").addEventListener("click", filter);

const user = document.getElementById("username").textContent;
let operations = await get_operations();
let predictions = await get_predictions();
let categories = await get_categories(user);
let accounts = await get_accounts(user);
window.onload = load_page();