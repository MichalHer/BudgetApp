import {get_operations} from "./operations_api.js";
import {get_predictions} from "./predictions_api.js";
import {get_transfers} from "./transfers_api.js";
import {get_accounts} from "./accounts_api.js";
import "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js";

async function get_currency_from_nbp(code){
    const response = await fetch(`https://api.nbp.pl/api/exchangerates/rates/A/${code}/`, {method:'GET', 'Content-Type':'application/json'});
    const data = await response.json();
    return data;
}

async function get_accounts_summary() {
    var table = "<thead>\
                    <tr>\
                            <td>Konto</td>\
                            <td>Stan</td>\
                    </tr>\
                </thead>\
                <tbody>"
    for(const account of accounts) {
        var operations_value = 0;
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
        current_accounts_value += operations_value * currency_value;
    }
    table += `<tr>
                <td>SUMA</td>
                <td>${current_accounts_value.toFixed(2)} PLN</td>
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
            } else if (balance > 0) {
                current_planned_outcomes +=  parseFloat(balance);
            }
        } else {
            if (balance < 0){
                color = "table-danger";
                if (operations_value == 0) current_planned_outcomes += parseFloat(balance);
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

function get_twelve_months(){
    var result = [];
    for(let x = 0; x < 13; x++){
        let date = new Date();
        date.setMonth(date.getMonth()+(x));
        let year = date.getFullYear();
        let month = date.getMonth();
        result.push(`${year}-${month+1}`); 
    }
    return result
}

function get_twelve_months_budget(dates){
    var result = [current_accounts_value-current_planned_outcomes]
    var previous_sum = current_accounts_value-current_planned_outcomes;
    for (let x = 1; x < dates.length; x++){
        let date = dates[x];
        let date_array = date.split("-");
        let date_from = Date.parse(date+"-1");
        let date_to = Date.parse(date + `-${last_day_of_month(date_array[0], date_array[1])}`);
        let temp_predictions = predictions.filter(x => Date.parse(x.date) >= date_from && Date.parse(x.date) <= date_to);
        var tmp_predictions_sum = 0;
        for (const prediction of temp_predictions){
            tmp_predictions_sum += prediction.value;
        }
        result.push(tmp_predictions_sum+previous_sum);
        previous_sum = tmp_predictions_sum+previous_sum;
    }
    return result;
}



let date_range = default_date_range();
document.getElementById("date_from").value = date_range[0];
document.getElementById("date_to").value = date_range[1];

const user = document.getElementById("username").textContent;
const transfers = await get_transfers();
const predictions = await get_predictions();
const operations = await get_operations(user);
const accounts = await get_accounts(user);

var current_accounts_value = 0;
var current_planned_outcomes = 0;

window.onload = current_month_summary_filter();
window.onload = await get_accounts_summary();



var dates = get_twelve_months();
var values = get_twelve_months_budget(dates);


window.onload = new Chart("chartContainer", {
    type: "bar",
    data: {
        labels: dates,
        datasets: [{
            data: values
        }]
    },
    options:{legend: {display: false}}
});



document.getElementById("filter_btn").addEventListener("click", current_month_summary_filter,true);

