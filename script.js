var table = document.getElementById("journals");
var trialBalance = document.getElementById("trialBalance");
var debitTotal = document.getElementById("dr");
var creditTotal = document.getElementById("cr");
var accJournal = document.getElementsByClassName("account");
var coa = document.getElementById("coa");
var accName = document.getElementById("accName");
var journalNumber = document.getElementById("journalNumber");
var journalListing = document.getElementById("journalListing");
var jrlDate = document.getElementById("jrlDate");
var jrlNarration = document.getElementById("jrlNarration")

function addAccountList(){
    // Looping through journal entry account column
    for (let i = 0; i < accJournal.length; i++) {
        accJournal[i].innerHTML = "";
        // Looping through accounts list from JSON file
        for (let j = 0; j < data.account.length; j++) {
            accJournal[i].innerHTML += "<option id=" + j + ">" + data.account[j].name + "</option>";    
        }
    }
}

function addNewLine(){
    // Create an empty <tr> element and add it to the 1st position of the table:
    var row = table.insertRow(table.rows.length - 2);

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    // Add some text to the new cells:
    cell1.innerHTML = "<select class='account'></select>";
    cell2.innerHTML = "<input class='debit' onblur='sumDebit()' type='number'>";
    cell3.innerHTML = "<input class='credit' onblur='sumCredit()' type='number'>";
    cell4.innerHTML = "<button class='delete'>X</button>";

    for (let j = 0; j < data.account.length; j++) {
        cell1.childNodes[0].innerHTML += "<option id=" + j + ">" + data.account[j].name + "</option>";    
    }

    cell4.childNodes[0].addEventListener("click", deleteLine);
}

function deleteLine(r){
    r.target.parentNode.parentNode.remove();  
    sumDebit();
    sumCredit();  
}

function sumDebit(){
    var debit = document.getElementsByClassName('debit');
    var drTotal = document.getElementById('dr');
    var tot = 0;

    for(var i = 0; i < debit.length; i++){
        if (parseFloat(debit[i].value) > 0){
            tot += parseFloat(debit[i].value);
            debit[i].value = (Math.round(debit[i].value * 100) / 100).toFixed(2);
        }
    }

    drTotal.innerHTML = (Math.round(tot * 100) / 100).toFixed(2);
}

function sumCredit(){
    var credit = document.getElementsByClassName('credit');
    var crTotal = document.getElementById('cr');
    var tot = 0;

    for(var i = 0; i < credit.length; i++){
        if (parseFloat(credit[i].value) > 0){
            tot += parseFloat(credit[i].value);
            credit[i].value = (Math.round(credit[i].value * 100) / 100).toFixed(2);
        }
    }

    crTotal.innerHTML = (Math.round(tot * 100) / 100).toFixed(2);
}

function sumColumn(col, id){
    var tot = 0;
    var loc = document.getElementById(id);

    for (let i = 1; i < trialBalance.rows.length - 1; i++) {
        tot += Number(trialBalance.rows[i].cells[col].innerHTML);
    }
    
    loc.innerHTML = tot;
}

function postJournal(){
    if(debitTotal.innerHTML === creditTotal.innerHTML && Number(debitTotal.innerHTML) > 0 && Number(creditTotal.innerHTML) > 0 && jrlDate.value !== ""){
        var leng = document.getElementsByClassName('debit').length; // Number of rows of journals
        var debit = document.getElementsByClassName('debit');
        var credit = document.getElementsByClassName('credit');
        var account = document.getElementsByClassName('account');

        data.journals.push([]);

        for(var i = 0; i < leng; i++){
            // Debit/Credit Account
            var acc = account[i].selectedIndex;
            var accountBalance = Number(data.account[acc].balance);
            var newBalance = Number(accountBalance) + Number(debit[i].value) - Number(credit[i].value);
            data.account[acc].balance = newBalance;

            // Record Journal in journals array
            data.journals[data.journals.length - 1].push(
                { 
                    name: account[i].value,
                    amount: Number(debit[i].value) - Number(credit[i].value),
                    date: jrlDate.value,
                    narration: jrlNarration.value
                }
            );
        }

        for (let i = leng - 1; i >= 0; i--) {
            // Clear Journals
            debit[i].value = "";
            credit[i].value = "";
            if(i > 1){
                table.deleteRow(i + 1);
            }
            
        }
        jrlDate.value = "";
        jrlNarration.value = "";
        sumDebit();
        sumCredit();
        updateTrialBalance();
        addAccountList();
        journalNumber.innerHTML =  data.journals.length;
        updateJournalListing();
    }
}

function updateTrialBalance(){
    for (let i = 1; i < trialBalance.rows.length - 1; i++) {
        trialBalance.deleteRow(i);        
    }

    for(var i = 0; i < data.account.length; i++){
        // Loop through all items stored and add them to trial balance
        if(trialBalance.rows[i + 1] != undefined && trialBalance.rows[i + 1].id != "tbTotal"){
            trialBalance.deleteRow(i + 1);
        }

        var row = trialBalance.insertRow(i + 1);

        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

        cell1.innerHTML = data.account[i].name;

        var bal = data.account[i].balance;

        if(bal > 0){
            cell2.innerHTML = bal;
            cell3.innerHTML = 0;
        }else if(bal < 0){
            cell2.innerHTML = 0;
            cell3.innerHTML = -bal;
        }else{
            cell2.innerHTML = 0;
            cell3.innerHTML = 0;
        }
    }

    sumColumn(1, 'tbDebit');
    sumColumn(2, 'tbCredit');
}

function updateJournalListing(){
    journalListing.innerHTML = "";
    var toprow = journalListing.insertRow(0)
    toprow.innerHTML = "<tr><th>No.</th><th>Date</th><th>Account</th><th>Debit</th><th>Credit</th><th>Narration</th></tr>"

    var pos = 0;

    for(var i = 0; i < data.journals.length; i++){
        for (let j = 0; j < data.journals[i].length; j++) {
            // Loop through all items stored and add them to trial balance
            var row = journalListing.insertRow(pos + 1);

            // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);

            cell1.innerHTML = i;
            cell2.innerHTML = data.journals[i][j].date;
            cell3.innerHTML = data.journals[i][j].name;
            cell6.innerHTML = data.journals[i][j].narration;

            var bal = data.journals[i][j].amount;

            if(bal > 0){
                cell4.innerHTML = bal;
                cell5.innerHTML = 0;
            }else if(bal < 0){
                cell4.innerHTML = 0;
                cell5.innerHTML = -bal;
            }else{
                cell4.innerHTML = 0;
                cell5.innerHTML = 0;
            }
            pos += 1;
        }
    }
}

function updateCOA(){
    for (let i = 1; i < coa.rows.length; i++) {
        coa.deleteRow(i);        
    }

    for(var i = 0; i < data.account.length; i++){
        if(coa.rows[i + 1] != undefined){
            coa.deleteRow(i + 1);
        }

        var row = coa.insertRow(i + 1);

        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);

        cell1.innerHTML = data.account[i].name;
    }

    var r = coa.insertRow(-1);
    var c1 = r.insertCell(0);
    var c2 = r.insertCell(1);
    c1.innerHTML = '<td><input id="accName" type="text"></td>';
    c2.innerHTML = "<td><button onclick='addToCoa()'>Add</button></td>";
    accName = document.getElementById("accName");
}

function addToCoa(){
    if(accName.value != ""){
        let accExists = false;
        
        for(var i = 0; i < data.account.length; i++){
            if(data.account[i].name === accName.value){
                accExists = true;
                console.log("Exists");
            }
        }

        if(accExists == false){
            data.account.push({"name":accName.value,"balance":0})
            accName.value = "";
            updateCOA();
            updateTrialBalance();
            addAccountList();
        }
    }
}

function showWorkspace(){
    var x = document.getElementById("workspace");
    x.hidden = false;
}