let data;
let fileHandle;
let base = {
    "account": [
        {
            "name": "Accounting Fees",
            "balance": 0
        },
        {
            "name": "Cash at Bank",
            "balance": 0
        },
        {
            "name": "Repairs & Maintenance",
            "balance": 0
        },
        {
            "name": "Sales",
            "balance": 0
        }
    ],

    "journals":[]
}

const settings = {
    excludeAcceptAllOption: false,
    multiple: false,
    types: [
        {
            accept: {
                'application/json':['.json']
            }
        },
    ]
};

async function openFile(){
    [fileHandle] = await window.showOpenFilePicker(settings);
    let fileData = await fileHandle.getFile();
    if(String(fileData.type) != "application/json"){
        console.log("Incorrect File Type!");
        fileData = "";
    }else{
        const myJson = await fileData.text();
        data = JSON.parse(myJson);
        showWorkspace();
        addAccountList();
        updateTrialBalance();
        updateCOA();
        updateJournalListing();
        journalNumber.innerHTML =  data.journals.length;
    }
}

async function saveFile(){
    if(data != undefined){
        let stream = await fileHandle.createWritable();
        await stream.write(JSON.stringify(data));
        await stream.close();
    }
}

async function saveAs(){
    fileHandle = await window.showSaveFilePicker(settings);
    saveFile();
}

async function newFile(){
    fileHandle = await window.showSaveFilePicker(settings);
    data = base;
    saveFile();
    showWorkspace();
    addAccountList();
    updateTrialBalance();
    updateCOA();
    updateJournalListing();
    journalNumber.innerHTML =  data.journals.length;
}