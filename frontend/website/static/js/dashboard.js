import {get_operations} from "./operations_api.js";
import {get_predictions} from "./predictions_api.js";
import {get_transfers} from "./transfers_api.js";
import {get_accounts} from "./accounts_api.js"

async function get_currency_from_nbp(code){
    const response = await fetch(`http://api.nbp.pl/api/exchangerates/rates/A/${code}/`, {method:'GET', 'Content-Type':'application/json'});
    const data = await response.json();
    return data;
}

async function get_accounts_summary() {
    var sum = 0;
    var table = "<thead>\
                    <tr>\
                            <td>Konto</td>\
                            <td>Stan</td>\
                    </tr>\
                </thead>\
                <tbody>"
    for(const account of accounts) {
        var operations_value = 0;
        var predictions_value = 0;
        // predictions.forEach(prediction => {
        //     if (prediction.account == account.ID_Acc){
        //         predictions_value += prediction.value;
        //     }
        // });
        operations.forEach(operation => {
            if (operation.account == account.ID_Acc){
                operations_value += operation.value;
            }
        });
        transfers.forEach(transfer => {
            if (transfer.to_account == account.ID_Acc){
                operations_value += transfer.value;
            } 
            if (transfer.from_account == account.ID_Acc){
                operations_value -= transfer.value;
            }
        });
        table +=    `<tr>\
                        <td>${account.name}</td>
                        <td>${operations_value.toFixed(2)} ${account.currency}</td>
                    </tr>`;
        var currency_value = 1;
        if (account.currency != "PLN") {
            const currency_data = await get_currency_from_nbp(account.currency);
            currency_value = currency_data.rates[0].mid;
        }
        sum += operations_value * currency_value;
    }
    table += `<tr>
                <td>SUMA</td>
                <td>${sum.toFixed(2)} PLN</td>
            </tr>`
    table += "</tbody>";
    document.getElementById("dashboard_accounts_table").innerHTML = table;
}

function current_month_summary(predictions) {
    var table = '';
for(const prediction of predictions){
    var operations_value = 0;
    var currency = accounts.find(x => x.ID_Acc == prediction.account).currency
    operations.forEach(element => {
        if (element.prediction == prediction.ID_Pred){
            operations_value += element.value;
        }
    });
    var balance = ((prediction.value - operations_value)*-1).toFixed(2)
    var color = null;
    if(prediction.value < 0){
        if (balance == 0){
            color = "table-success";
        } else if (balance < 0){
            color = "table-danger";
        }
    } else {
        if (balance < 0){
            color = "table-danger";
        } else if (balance >= 0){
            color = "table-success";
        }
    }

    table += `<tr`;
    if (color != null){
        table += ` class="${color}"`;
    }
    table += `>\
                <td>${prediction.date}</td>
                <td>${accounts.find(x => x.ID_Acc == prediction.account).name}</td>
                <td>${prediction.purpose_of_the_expendture}</td>
                <td>${prediction.value.toFixed(2)} ${currency}</td>
                <td>${operations_value.toFixed(2)} ${currency}</td>
                <td>${balance} ${currency}</td>
            </tr>`
}
document.getElementById("dashboard_current_month_body").innerHTML = table;
document.getElementById("filter_btn").addEventListener("click", current_month_summary_filter,true);
}

async function current_month_summary_filter(){
    const date_from_str = document.getElementById("date_from").value;
    const date_to_str = document.getElementById("date_to").value;
    const date_from = Date.parse(date_from_str);
    const date_to = Date.parse(date_to_str);
    const filtered_predictions = predictions.filter(x => Date.parse(x.date) >= date_from && Date.parse(x.date) <= date_to);
    current_month_summary(filtered_predictions);
}

function last_day_of_month(year, month){
    return new Date(year, month, 0).getDate();
}

function default_date_range(){
    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_year = date.getFullYear()
    let date_from = `${current_year}-${current_month}-01`;
    let date_to = `${current_year}-${current_month}-${last_day_of_month(current_year, current_month)}`
    return [date_from, date_to];
}

let date_range = default_date_range();
document.getElementById("date_from").value = date_range[0];
document.getElementById("date_to").value = date_range[1];

const user = document.getElementById("username").textContent;
const transfers = await get_transfers(user);
const predictions = await get_predictions(user);
const operations = await get_operations(user);
const accounts = await get_accounts(user);

window.onload = get_accounts_summary();
window.onload = current_month_summary_filter();

document.getElementById("filter_btn").addEventListener("click", current_month_summary_filter,true);

