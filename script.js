const table = document.getElementById("journals");
const trialBalance = document.getElementById("trialBalance");
const debitTotal = document.getElementById("dr");
const creditTotal = document.getElementById("cr");
const accJournal = document.getElementsByClassName("account");
const coa = document.getElementById("coa");
let accName = document.getElementById("accName");
const journalNumber = document.getElementById("journalNumber");
const journalListing = document.getElementById("journalListing");
const jrlDate = document.getElementById("jrlDate");
const jrlNarration = document.getElementById("jrlNarration");
const generalLedger = document.getElementById("generalLedger");
const jrlStartDate = document.getElementById("jrlStartDate");
const jrlEndDate = document.getElementById("jrlEndDate");
const glStartDate = document.getElementById("glStartDate");
const glEndDate = document.getElementById("glEndDate");

function addAccountList(){
    // Looping through journal entry account column
    for (let i = 0; i < accJournal.length; i++) {
        let ind = accJournal[i].selectedIndex;
        accJournal[i].innerHTML = "";
        // Looping through accounts list from JSON file
        for (let j = 0; j < data.account.length; j++) {
            accJournal[i].innerHTML += "<option id=" + j + ">" + data.account[j].name + "</option>";    
        }
        accJournal[i].selectedIndex = ind;
    }
}

function resetAccountList(){
    for (let i = 0; i < accJournal.length; i++) {
        accJournal[i].selectedIndex = -1;
    }
}

function checkAccountEmpty(){
    for (let i = 0; i < accJournal.length; i++) {
        if(accJournal[i].selectedIndex === -1){
            return false;
        }
    }
    return true;
}

function addNewLine(){
    // Create an empty <tr> element and add it to the 1st position of the table:
    const row = table.insertRow(table.rows.length - 2);

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);

    // Add some text to the new cells:
    cell1.innerHTML = "<select class='account'></select>";
    cell2.innerHTML = "<input class='debit' onblur='sumDebit()' type='number'>";
    cell3.innerHTML = "<input class='credit' onblur='sumCredit()' type='number'>";
    cell4.innerHTML = "<button class='delete'>X</button>";

    for (let j = 0; j < data.account.length; j++) {
        cell1.childNodes[0].innerHTML += "<option id=" + j + ">" + data.account[j].name + "</option>";    
    }

    cell1.childNodes[0].selectedIndex = -1;
    cell4.childNodes[0].addEventListener("click", deleteLine);
}

function deleteLine(r){
    r.target.parentNode.parentNode.remove();  
    sumDebit();
    sumCredit();  
}

function sumDebit(){
    const debit = document.getElementsByClassName('debit');
    const drTotal = document.getElementById('dr');
    let tot = 0;

    for(let i = 0; i < debit.length; i++){
        if (parseFloat(debit[i].value) > 0){
            tot += parseFloat(debit[i].value);
            debit[i].value = (Math.round(debit[i].value * 100) / 100).toFixed(2);
        }
    }

    drTotal.innerHTML = (Math.round(tot * 100) / 100).toFixed(2);
}

function sumCredit(){
    const credit = document.getElementsByClassName('credit');
    const crTotal = document.getElementById('cr');
    let tot = 0;

    for(let i = 0; i < credit.length; i++){
        if (parseFloat(credit[i].value) > 0){
            tot += parseFloat(credit[i].value);
            credit[i].value = (Math.round(credit[i].value * 100) / 100).toFixed(2);
        }
    }

    crTotal.innerHTML = (Math.round(tot * 100) / 100).toFixed(2);
}

function removeCommas(str) {
    while (str.search(",") >= 0) {
        str = (str + "").replace(',', '');
    }
    return str;
}

function postJournal(){
    if(debitTotal.innerHTML !== creditTotal.innerHTML){
        confirm("JOURNAL DOES NOT BALANCE");
    }

    if(jrlDate.value === ""){
        confirm("NO DATE ENTERED");
    }

    if(checkAccountEmpty() === false){
        confirm("MISSING ACCOUNT");
    }

    if(debitTotal.innerHTML === creditTotal.innerHTML && Number(debitTotal.innerHTML) > 0 && Number(creditTotal.innerHTML) > 0 && jrlDate.value !== "" && checkAccountEmpty()){
        const leng = document.getElementsByClassName('debit').length; // Number of rows of journals
        const debit = document.getElementsByClassName('debit');
        const credit = document.getElementsByClassName('credit');
        const account = document.getElementsByClassName('account');

        data.journals.push([]);

        for(let i = 0; i < leng; i++){
            // Debit/Credit Account
            const acc = account[i].selectedIndex;
            const accountBalance = Number(data.account[acc].balance);
            const newBalance = Number(accountBalance) + Number(debit[i].value) - Number(credit[i].value);
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
        resetAccountList()
        journalNumber.innerHTML =  data.journals.length;
        updateJournalListing();
        updateGL()
    }
}

function updateTrialBalance(){
    trialBalance.innerHTML = "<tr><th>Account</th><th>Debit</th><th>Credit</th></tr>";
    let totalDebit = 0;
    let totalCredit = 0;

    for (let k = 0; k < data.account.length; k++) {
        let bal = 0;
        const row = trialBalance.insertRow(k + 1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        cell1.innerHTML = data.account[k].name;

        for(let i = 0; i < data.journals.length; i++){
            for (let j = 0; j < data.journals[i].length; j++) {
                if(data.journals[i][j].name === data.account[k].name){
                    bal += data.journals[i][j].amount;
                }
            }
        }
        
        if(bal > 0){
            cell2.innerHTML = bal.toLocaleString('en-US');
            cell3.innerHTML = 0;
            totalDebit += bal;
        }else if(bal < 0){
            cell2.innerHTML = 0;
            cell3.innerHTML = (bal*-1).toLocaleString('en-US');
            totalCredit += bal * -1;
        }else{
            cell2.innerHTML = 0;
            cell3.innerHTML = 0;
        }

    }

    const total = trialBalance.insertRow(trialBalance.rows.length);
    const cell1 = total.insertCell(0);
    const cell2 = total.insertCell(1);
    const cell3 = total.insertCell(2);

    cell1.outerHTML = `<th class='title'>Total</th>`;
    cell2.outerHTML = `<th class='title'>${totalDebit}</th>`;
    cell3.outerHTML = `<th class='title'>${totalCredit}</th>`;
}

function updateJournalListing(){
    journalListing.innerHTML = "";
    const toprow = journalListing.insertRow(0)
    toprow.innerHTML = "<tr><th>No.</th><th>Date</th><th>Account</th><th>Debit</th><th>Credit</th><th>Narration</th></tr>"

    let pos = 0;

    for(let i = 0; i < data.journals.length; i++){
        for (let j = 0; j < data.journals[i].length; j++) {
            if(compareTime(data.journals[i][j].date,jrlStartDate.value) && compareTime(jrlEndDate.value,data.journals[i][j].date)){
                // Loop through all items stored and add them to trial balance
                const row = journalListing.insertRow(pos + 1);

                // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);
                const cell4 = row.insertCell(3);
                const cell5 = row.insertCell(4);
                const cell6 = row.insertCell(5);

                cell1.innerHTML = i;
                cell2.innerHTML = data.journals[i][j].date;
                cell3.innerHTML = data.journals[i][j].name;
                cell6.innerHTML = data.journals[i][j].narration;

                const bal = data.journals[i][j].amount;
                cell6.classList.add('wrap')

                if(bal > 0){
                    cell4.innerHTML = bal.toLocaleString('en-US');
                    cell5.innerHTML = 0;
                }else if(bal < 0){
                    cell4.innerHTML = 0;
                    cell5.innerHTML = (bal*-1).toLocaleString('en-US');
                }else{
                    cell4.innerHTML = 0;
                    cell5.innerHTML = 0;
                }

                pos += 1;
            }
        }
    }
}

function updateCOA(){
    for (let i = 1; i < coa.rows.length; i++) {
        coa.deleteRow(i);        
    }

    for(let i = 0; i < data.account.length; i++){
        if(coa.rows[i + 1] != undefined){
            coa.deleteRow(i + 1);
        }

        const row = coa.insertRow(i + 1);

        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);      // Use in future to show account type i.e. asset, liability etc.

        cell1.innerHTML = data.account[i].name;
    }

    const r = coa.insertRow(-1);
    const c1 = r.insertCell(0);
    const c2 = r.insertCell(1);
    c1.innerHTML = '<td><input id="accName" type="text"><button onclick="addToCoa()">Add</button></td>';
    //c2.innerHTML = "<td><button onclick='addToCoa()'>Add</button></td>";
    accName = document.getElementById("accName");
}

function addToCoa(){
    if(accName.value != ""){
        let accExists = false;
        
        for(let i = 0; i < data.account.length; i++){
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
            updateGL()
        }
    }
}

function showWorkspace(){
    const x = document.getElementById("workspace");
    x.hidden = false;
}

function show(id){
    if(document.getElementById(id).hidden === true){
        document.getElementById(id).hidden = false;
    }else{
        document.getElementById(id).hidden = true;
    }
}

function updateGL() {
    generalLedger.innerHTML = "";
    const toprow = generalLedger.insertRow(0)
    toprow.innerHTML = "<tr><th>Account</th><th>No.</th><th>Date</th><th>Narration</th><th>Debit</th><th>Credit</th></tr>"

    for (let k = 0; k < data.account.length; k++) {
        console.log(data.account[k].name);
        let totalDebit = 0;
        let totalCredit = 0;

        const title = generalLedger.insertRow(generalLedger.rows.length)
        const cell1 = title.insertCell(0);
        const cell2 = title.insertCell(1)
        const cell3 = title.insertCell(2);
        const cell4 = title.insertCell(3);
        const cell5 = title.insertCell(4);
        const cell6 = title.insertCell(5);

        cell1.outerHTML = `<th class='title'>${data.account[k].name}</th>`
        cell2.outerHTML = `<th class='title'></th>`
        cell3.outerHTML = `<th class='title'></th>`
        cell4.outerHTML = `<th class='title'></th>`
        cell5.outerHTML = `<th class='title'></th>`
        cell6.outerHTML = `<th class='title'></th>`

        for(let i = 0; i < data.journals.length; i++){
            for (let j = 0; j < data.journals[i].length; j++) {
                if(data.journals[i][j].name === data.account[k].name && compareTime(data.journals[i][j].date,glStartDate.value) && compareTime(glEndDate.value,data.journals[i][j].date)){
                    const row = generalLedger.insertRow(generalLedger.rows.length)
                    const cell1 = row.insertCell(0);
                    const cell2 = row.insertCell(1);
                    const cell3 = row.insertCell(2);
                    const cell4 = row.insertCell(3);
                    const cell5 = row.insertCell(4);
                    const cell6 = row.insertCell(5);

                    cell2.innerHTML = i;
                    cell3.innerHTML = data.journals[i][j].date;
                    cell4.innerHTML = data.journals[i][j].narration;

                    const bal = data.journals[i][j].amount;

                    if(bal > 0){
                        cell5.innerHTML = bal.toLocaleString('en-US');
                        cell6.innerHTML = 0;
                        totalDebit += bal;
                    }else if(bal < 0){
                        cell5.innerHTML = 0;
                        cell6.innerHTML = (bal*-1).toLocaleString('en-US');
                        totalCredit += bal * -1;
                    }else{
                        cell5.innerHTML = 0;
                        cell6.innerHTML = 0;
                    }

                    console.log(data.journals[i][j])
                }
            }
        }

        const accBalance = generalLedger.insertRow(generalLedger.rows.length)
        const c1 = accBalance.insertCell(0);
        const c2 = accBalance.insertCell(1)
        const c3 = accBalance.insertCell(2);
        const c4 = accBalance.insertCell(3);
        const c5 = accBalance.insertCell(4);
        const c6 = accBalance.insertCell(5);
        

        c1.outerHTML = `<th class='total'>Total</th>`
        c2.outerHTML = `<th class='total'></th>`
        c3.outerHTML = `<th class='total'></th>`
        c4.outerHTML = `<th class='total'></th>`
        c5.outerHTML = `<th class='total'>${totalDebit.toLocaleString('en-US')}</th>`
        c6.outerHTML = `<th class='total'>${totalCredit.toLocaleString('en-US')}</th>`
    }
}

function compareTime(time1, time2) {
    return new Date(time1) >= new Date(time2); // true if time1 is later
}