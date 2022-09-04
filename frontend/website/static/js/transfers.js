import {get_accounts} from "./accounts_api.js";
import {get_transfers, delete_transfer, add_transfer, change_transfer} from "./transfers_api.js";

async function transfers_table_for(username){
    const accounts = await get_accounts(username);
    const transfers = await get_transfers(username);
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
        delete_transfer(user, id).then(transfers_table_for(user));
    }
}

async function add_or_change_trans() {
    const from_account = document.getElementById("from_account_select").value;
    const to_account = document.getElementById("to_account_select").value;
    const date = document.getElementById("date").value;
    const value = document.getElementById("value").value;
    
    const user = document.getElementById("username").textContent;
    var radios = document.getElementsByName('radio_btn');
    var id = null;
    for (let i of radios){
        if (i.checked) {
            id = i.value;
        }
    }
    if (id != null){
        change_transfer(user, from_account, to_account, date, value, id).then(transfers_table_for(user));
    } else {
        add_transfer(user, from_account, to_account, date, value).then(transfers_table_for(user));
    }
}

async function unmark_radios() {
    var radios = document.getElementsByName('radio_btn');
    for (let i of radios){
        i.checked = false;
    }
}

async function modal_init(username){
    const accounts = await get_accounts(username);
    var accounts_sel = '<option selected>Wybierz konto</option>'
    if (accounts.length != 0){
        accounts.forEach(element => {
        accounts_sel += `<option name="acc_sel" value="${element.ID_Acc}">${element.currency} ${element.name}</option>`;
        });
    }
    document.getElementById('from_account_select').innerHTML=accounts_sel;
    document.getElementById('to_account_select').innerHTML=accounts_sel;
}

document.getElementById("remove_button").addEventListener("click", delete_trans);
document.getElementById("confirm_btn").addEventListener("click", add_or_change_trans);
document.getElementById("add_button").addEventListener("click", unmark_radios);
const user = document.getElementById("username").textContent;
window.onload = transfers_table_for(user);
window.onload = modal_init(user);

