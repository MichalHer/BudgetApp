import {get_accounts, delete_account, add_account, change_account_name} from "./api.js";

async function accounts_table_for(username){
    const accounts = await get_accounts(username);
    var table_html = '<tr>\
        <th width="5%"></th>\
        <th width="10%">id konta</th>\
        <th width="20%">Nazwa konta</th>\
        <th>Właściciele</th>\
    </tr>'
    if (accounts.length != 0){
        accounts.forEach(element => {
            table_html += '<tr>\
            <td>\
                <div class="form-check">\
                    <input class="form-check-input" type="radio" name="radio_btn" value="' + element.ID_Acc + '" id="radio_' + element.ID_Acc + '">\
                    <label class="form-check-label" for="radio_' + element.ID_Acc + '">\
                    </label>\
                </div>\
            </td>\
            <td><a class="nav-link" href="#">' + element.ID_Acc + '</a></td>\
            <td><a class="nav-link" href="#">' + element.name + '</a></td>\
            <td>'
            element.owners.forEach(element => {
                table_html += ('| '+element.nick+' ');
            })
            table_html += '</td>\
            </tr>'
            
        });
    }
    document.getElementById('accounts_table').innerHTML=table_html;
}

async function delete_acc() {
    const user = document.getElementById("username").textContent;
    var radios = document.getElementsByName('radio_btn');
    var id = null;
    for (let i of radios){
        if (i.checked) {
            id = i.value;
        }
    }
    if (id != null){
        delete_account(user, id);
        console.log("Done " + id);
        accounts_table_for(user);
    }
}

async function add_or_change_acc() {
    const account_name = document.getElementById("account_name").value;
    if (account_name != '' && account_name != null) {
        const user = document.getElementById("username").textContent;
        var radios = document.getElementsByName('radio_btn');
        var id = null;
        for (let i of radios){
            if (i.checked) {
                id = i.value;
            }
        }
        if (id != null){
            change_account_name(user, account_name, id);
        } else {
            add_account(user, account_name);
        }
    }
    accounts_table_for(user);
}

async function unmark_radios() {
    var radios = document.getElementsByName('radio_btn');
    for (let i of radios){
        i.checked = false;
    }
}

document.getElementById("remove_button").addEventListener("click", delete_acc);
document.getElementById("confirm_btn").addEventListener("click", add_or_change_acc);
document.getElementById("add_button").addEventListener("click", unmark_radios);
const user = document.getElementById("username").textContent;
window.onload = accounts_table_for(user);

