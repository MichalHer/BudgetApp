import {get_accounts} from "./accounts_api.js";
import {get_transfers, delete_transfer, add_transfer, change_transfer} from "./transfers_api.js";

async function transfers_table(transfers){
    var table_html = '<thead><tr>\
                    <th scope="col" width="5%"></th>\
                    <th scope="col" width="10%">id transferu</th>\
                    <th scope="col" width="20%">Z konta</th>\
                    <th scope="col" width="20%">\Na konto</th>\
                    <th scope="col">Data</th>\
                    <th scope="col">Wartość</th></tr>\
                    </thead><tbody>'
    if (transfers.length != 0){
        transfers.forEach(element => {
            table_html += '<tr><th scope="row">\
                        <div class="form-check">\
                        <input class="form-check-input" type="radio" name="radio_btn" value="' + element.ID_Tr + '" id="radio_' + element.ID_Tr + 
                        '"><label class="form-check-label" for="radio_' + element.ID_Tr + '"></label></div></th>\
                        <td><a class="nav-link" href="#">' + element.ID_Tr + '</a></td>\
                        <td><a class="nav-link" href="#">' + accounts.find(x => x.ID_Acc == element.from_account).name + '</a></td>\
                        <td><a class="nav-link" href="#">' + accounts.find(x => x.ID_Acc == element.to_account).name + '</a></td>\
                        <td><a class="nav-link" href="#">' + element.date + '</a></td>\
                        <td><a class="nav-link" href="#">' + element.value + '</a></td></tr>'
        });
    }
    table_html += '</tbody>'
    document.getElementById('transfers_table').innerHTML=table_html;
    document.getElementById("remove_button").addEventListener("click", delete_trans);
    document.getElementById("confirm_btn").addEventListener("click", add_or_change_trans);
    document.getElementById("add_button").addEventListener("click", unmark_radios);
}

async function delete_trans() {
    const user = document.getElementById("username").textContent;
    var radios = document.getElementsByName('radio_btn');
    var id = null;
    for (let i of radios){
        if (i.checked) {
            id = i.value;
        }
    }
    if (id != null){
        await delete_transfer(user, id);
        transfers = transfers.filter(x => x.ID_Tr != id);
        if (document.getElementById("month").value == 0 && document.getElementById("year").value == ""){
            await transfers_table(transfers);
        } else {
            await filter();
        }
    }
}

async function add_or_change_trans() {
    const from_account = document.getElementById("from_account_select").value;
    const to_account = document.getElementById("to_account_select").value;
    const date = document.getElementById("date").value;
    const value = document.getElementById("value").value;
    let new_transfer = null;
    const user = document.getElementById("username").textContent;
    var radios = document.getElementsByName('radio_btn');
    var id = null;
    for (let i of radios){
        if (i.checked) {
            id = i.value;
        }
    }
    if (id != null){
        new_transfer = await change_transfer(user, from_account, to_account, date, value, id);
        transfers = transfers.filter(x => x.ID_Tr != id);
        transfers.push(new_transfer);
        if (document.getElementById("month").value == 0 && document.getElementById("year").value == ""){
            await transfers_table(transfers);
        } else {
            await filter();
        }
    } else {
        new_transfer = await add_transfer(user, from_account, to_account, date, value);
        transfers.push(new_transfer);
        if (document.getElementById("month").value == 0 && document.getElementById("year").value == ""){
            await transfers_table(transfers);
        } else {
            await filter();
        }
    }
}

async function unmark_radios() {
    var radios = document.getElementsByName('radio_btn');
    for (let i of radios){
        i.checked = false;
    }
}

async function modal_init(){
    var accounts_sel = '<option selected>Wybierz konto</option>'
    if (accounts.length != 0){
        accounts.forEach(element => {
        accounts_sel += `<option name="acc_sel" value="${element.ID_Acc}">${element.currency} ${element.name}</option>`;
        });
    }
    document.getElementById('from_account_select').innerHTML=accounts_sel;
    document.getElementById('to_account_select').innerHTML=accounts_sel;
    document.getElementById("remove_button").addEventListener("click", delete_trans);
    document.getElementById("confirm_btn").addEventListener("click", add_or_change_trans);
    document.getElementById("add_button").addEventListener("click", unmark_radios);
}

function last_day_of_month(year, month){
    return new Date(year, month, 0).getDate();
}

async function filter(){
    let year = document.getElementById("year").value;
    let month = document.getElementById("month").value;
    let date_from = Date.parse(`${year}-${month}-01`);
    let date_to = Date.parse(`${year}-${month}-${last_day_of_month(year,month)}`);
    let filtered_transfers = transfers.filter(x => Date.parse(x.date) >= date_from && Date.parse(x.date) <= date_to);
    await transfers_table(filtered_transfers);
}

document.getElementById("remove_button").addEventListener("click", delete_trans);
document.getElementById("confirm_btn").addEventListener("click", add_or_change_trans);
document.getElementById("add_button").addEventListener("click", unmark_radios);
document.getElementById("filter").addEventListener("click", filter);
let user = document.getElementById("username").textContent;
let accounts = await get_accounts(user);
let transfers = await get_transfers(user);
window.onload = transfers_table(transfers);
window.onload = modal_init();

