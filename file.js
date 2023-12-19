let data;
let fileHandle;
let base = {
    "account": [
        {
            "name": "Accounting Fees",
        },
        {
            "name": "Cash at Bank",
        },
        {
            "name": "Repairs & Maintenance",
        },
        {
            "name": "Sales",
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
    let conf = true;

    if(data !== undefined){
        conf = confirm("Any unsaved changes will discarded, do you want to continue?")
    }  
    
    if(conf === true){
        [fileHandle] = await window.showOpenFilePicker(settings);
        let fileData = await fileHandle.getFile();
        if(String(fileData.type) != "application/json"){
            console.log("Incorrect File Type!");
            fileData = "";
        }else{
            const myJson = await fileData.text();
            data = JSON.parse(myJson);
            openWorkspace();
        }
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
    openWorkspace();
}

function openWorkspace(){
    showWorkspace();
    addAccountList();
    updateTrialBalance();
    updateCOA();
    updateJournalListing();
    updateGL()
    journalNumber.innerHTML =  data.journals.length;
}
 