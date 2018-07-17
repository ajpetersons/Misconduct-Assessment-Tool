// Set name and other global variables, Django variables for this page
pageName = "Uploading";

let uploadFileFinish = false;
let uploadFolderFinish = false;

function uploadFile() {
    uploadFileFinish = true;
    openNextButton();
    document.getElementById("uploadFile_Label").classList.remove("btn-outline-primary");
    document.getElementById("uploadFile_Label").classList.add("btn-outline-secondary");
    document.getElementById("uploadFile_Label").classList.add("disabled");
    singleFile = new FormData($('#uploadFile_Form')[0]);
    $.ajax({
        url: "uploadFile/",
        type: 'POST',
        cache: false,
        data: singleFile,
        processData: false,
        contentType: false,
        dataType:"json",
        beforeSend: function(){
            uploading = true;
        },
        success : function(data) {
            uploading = false;
        }
    });
}

function uploadFolder() {
    uploadFolderFinish = true;
    openNextButton();
    document.getElementById("uploadFolder_Label").classList.remove("btn-outline-primary");
    document.getElementById("uploadFolder_Label").classList.add("btn-outline-secondary");
    document.getElementById("uploadFolder_Label").classList.add("disabled");
    var folderFileList = $('#uploadFolder_Form')[0];

    folderFile = new FormData(folderFileList);


    $.ajax({
        url: "uploadFolder/",
        type: 'POST',
        cache: false,
        data: folderFile,
        processData: false,
        contentType: false,
        dataType:"json",
        beforeSend: function(){
            uploading = true;
        },
        success : function(data) {
            uploading = false;
        }
    });
}

function openNextButton() {
    if (uploadFileFinish == true && uploadFolderFinish == true)
    {
        document.getElementById("nextButton").removeAttribute("disabled");
        document.getElementById("nextButton").removeAttribute("title");
    }
}

$(document).ready(function () {
    if ((fileToComparePathList != "NOFOLDEREXISTS") && folderPathList[0] != "NOFOLDEREXISTS")
    {
        uploadFileFinish = true;
        uploadFolderFinish = true;
        openNextButton();
    }
});