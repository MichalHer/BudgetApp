import {get_predictions, delete_prediction, add_prediction, change_prediction} from "./predictions_api.js"; //
import {get_categories} from "./categories_api.js";
import {get_accounts} from "./accounts_api.js";

async function predictions_table(predictions){
    let table_html = '<thead><tr>\
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
    document.getElementById("remove_button").addEventListener("click", delete_pred);
    document.getElementById("confirm_btn").addEventListener("click", add_or_change_prediction);
    document.getElementById("add_button").addEventListener("click", unmark_radios);
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
    document.getElementById("remove_button").addEventListener("click", delete_pred);
    document.getElementById("confirm_btn").addEventListener("click", add_or_change_prediction);
    document.getElementById("add_button").addEventListener("click", unmark_radios);
}

async function load_page(){
    await predictions_table(predictions);
    await modal_init();
}

async function delete_pred() {
    const user = document.getElementById("username").textContent;
    let radios = document.getElementsByName('radio_btn');
    let id = null;
    for (let i of radios){
        if (i.checked) {
            id = i.value;
        }
    }
    if (id != null){
        await delete_prediction(user, id);
        predictions = predictions.filter(x => x.ID_Pred != id);
        await predictions_table();
    }
}

async function add_or_change_prediction() {
        const category_id = document.getElementById("categories_select").value;
        const account_id = document.getElementById("accounts_select").value;
        const prediction_date = document.getElementById("date").value;
        const prediction_pote = document.getElementById("description").value;
        const prediction_value = document.getElementById("value").value;
        const user = document.getElementById("username").textContent;
        let new_prediction = null;
        let radios = document.getElementsByName('radio_btn');
        let id = null;
        for (let i of radios){
            if (i.checked) {
                id = i.value;
            }
        }
        if (id != null){
            new_prediction = await change_prediction(user, category_id, account_id, prediction_date, prediction_pote, prediction_value, id);
            predictions = predictions.filter(x => x.ID_Pred != id);
            predictions.push(new_prediction);
            await predictions_table();
        } else {
            new_prediction = await add_prediction(user, category_id, account_id, prediction_date, prediction_pote, prediction_value);
            predictions.push(new_prediction);
            await predictions_table();
        }
}

async function unmark_radios() {
    let radios = document.getElementsByName('radio_btn');
    for (let i of radios){
        i.checked = false;
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
    let filtered_predictions = predictions.filter(x => Date.parse(x.date) >= date_from && Date.parse(x.date) <= date_to);
    await predictions_table(filtered_predictions);
}


document.getElementById("remove_button").addEventListener("click", delete_pred);
document.getElementById("confirm_btn").addEventListener("click", add_or_change_prediction);
document.getElementById("add_button").addEventListener("click", unmark_radios);
document.getElementById("filter").addEventListener("click", filter);
const user = document.getElementById("username").textContent;
let predictions = await get_predictions(user);
let categories = await get_categories(user);
let accounts = await get_accounts(user);
window.onload = load_page(user)