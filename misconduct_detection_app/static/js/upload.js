// Set name and other global variables, Django variables for this page
pageName = "Upload";

let uploadFileFinish = false;
let uploadFolderFinish = false;

function modifyDOMAfterUploadingFile() {
    uploadFileFinish = true;
    openNextButton();
    $("#uploadFileLabel").text("Reupload");
    $("#uploadFileCheck").empty();
}

function modifyDOMAfterUploadingFolder() {
    uploadFolderFinish = true;
    openNextButton();
    $("#uploadFolderLabel").text("Reupload");
    $("#uploadFolderCheck").empty();
}

function uploadFile() {
    modifyDOMAfterUploadingFile();
    let singleFile = new FormData($('#uploadFileForm')[0]);
    $("#uploadFileCheck").append("<i class='fa fa-spinner fa-spin'></i> Please wait while uploading...");
    
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

    $(document).ajaxStop(function() {
        $("#uploadFileCheck").empty();
        $("#uploadFileCheck").append("<i class='material-icons'>check</i> Selected file uploaded.");

    });
}

function uploadFolder() {
    modifyDOMAfterUploadingFolder();
    let folderFile = new FormData($('#uploadFolderForm')[0]);
    $("#uploadFolderCheck").append("<i class='fa fa-spinner fa-spin'></i> Please wait while uploading...");

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

    $(document).ajaxStop(function() {
        $("#uploadFolderCheck").empty();
        $("#uploadFolderCheck").append("<i class='material-icons'>check</i>Selected folder uploaded.");
    });
}

function openNextButton() {
    if (uploadFileFinish == true && uploadFolderFinish == true) {
        document.getElementById("nextButton").removeAttribute("disabled");
        document.getElementById("nextButton").removeAttribute("title");
    }
}

$("#uploadFileForm").change(function (){
    uploadFile(); 
 });

$("#uploadFolderForm").change(function (){
   uploadFolder(); 
});

$(document).ready(function () {
    if (fileToComparePathList != "NOFOLDEREXISTS") {
        modifyDOMAfterUploadingFile();
        $("#uploadFileCheck").empty();
        $("#uploadFileCheck").append("<i class='material-icons'>check</i> File uploaded.");
    }

    if (folderPathList[0] != "NOFOLDEREXISTS") {
        modifyDOMAfterUploadingFolder();
        $("#uploadFolderCheck").empty();
        $("#uploadFolderCheck").append("<i class='material-icons'>check</i> Folder uploaded.");
    }
    openNextButton();
    console.log('document.ready()')
});
