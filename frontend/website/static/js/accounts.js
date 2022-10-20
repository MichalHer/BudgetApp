import {get_accounts, delete_account, add_account, change_account} from "./accounts_api.js";

async function accounts_table(){
    let table_html = '<thead><tr><th scope="col" width="5%"></th><th scope="col" width="10%">id konta</th><th scope="col" width="10%">Waluta</th><th scope="col" width="20%">Nazwa konta</th><th scope="col">Właściciele</th></tr></thead><tbody>'
    if (accounts.length != 0){
        accounts.forEach(element => {
            table_html += '<tr><th scope="row"><div class="form-check"><input class="form-check-input" type="radio" name="radio_btn" value="' + element.ID_Acc + '" id="radio_' + element.ID_Acc + 
            '"><label class="form-check-label" for="radio_' + element.ID_Acc + '"></label></div></th><td><a class="nav-link" href="#">' + element.ID_Acc + 
            '</a></td><td><a class="nav-link" href="#">' + element.currency + '</a></td><td><a class="nav-link" href="#">' + element.name + '</a></td><td>'
            element.owners.forEach(element => {
                table_html += ('| '+element.nick+' ');
            })
            table_html += '</td></tr>'
            
        });
    }
    table_html += '</tbody>'
    document.getElementById('accounts_table').innerHTML=table_html;
    document.getElementById("remove_button").addEventListener("click", delete_acc);
    document.getElementById("confirm_btn").addEventListener("click", add_or_change_acc);
    document.getElementById("add_button").addEventListener("click", unmark_radios);
}

async function delete_acc() {
    const user = document.getElementById("username").textContent;
    let radios = document.getElementsByName('radio_btn');
    let id = null;
    for (let i of radios){
        if (i.checked) {
            id = i.value;
        }
    }
    if (id != null){
        await delete_account(id);
        accounts = accounts.filter(x => x.ID_Acc != id);
        await accounts_table();
    }
}

async function add_or_change_acc() {
    const account_name = document.getElementById("account_name").value;
    const currency = document.getElementById("currency").value;
    let new_account = null;
    const user = document.getElementById("username").textContent;
    let radios = document.getElementsByName('radio_btn');
    let id = null;
    for (let i of radios){
        if (i.checked) {
            id = i.value;
        }
    }
    if (id != null){
        new_account = await change_account(account_name, id, currency);
        accounts = accounts.filter(x => x.ID_Acc != id)
        accounts.push(new_account);
    } else {
        new_account = await add_account(account_name, currency);
        accounts.push(new_account);
    }
    
    console.log(new_account);
    await accounts_table();
}

async function unmark_radios() {
    let radios = document.getElementsByName('radio_btn');
    for (let i of radios){
        i.checked = false;
    }
}

document.getElementById("remove_button").addEventListener("click", delete_acc);
document.getElementById("confirm_btn").addEventListener("click", add_or_change_acc);
document.getElementById("add_button").addEventListener("click", unmark_radios);
const user = document.getElementById("username").textContent;
let accounts = await get_accounts()
window.onload = accounts_table();

