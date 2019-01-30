// Set name and other global variables, Django variables for this page
pageName = "Upload";

let uploadFileFinish = false;
let uploadFolderFinish = false;

function setFileDetectionPackage() {
    $.ajax({
        url: '/select/autoDetect/',
        type: "GET",
        dataType: "json",
        success: function (autoDetectResults) {
            let autoDetectionLibSelection = autoDetectResults[0];
            let autoDetectionLanguage = autoDetectResults[1];
            if (autoDetectResults === "FILE_TYPE_NOT_SUPPORTED") {
                $("#languageSelectionModal").modal("show");
                autoDetectionLibSelection = "JPlag";
                autoDetectionLanguage = "text";
            }

            let programmingConfigs = new FormData();
            programmingConfigs.append("csrfmiddlewaretoken", document.getElementsByName('csrfmiddlewaretoken')[0].value);
            programmingConfigs.append("detectionLibSelection", autoDetectionLibSelection);
            programmingConfigs.append("detectionLanguage", autoDetectionLanguage);
            $.ajax({
                url: "/configs/savingConfigs/",
                type: 'POST',
                cache: false,
                data: programmingConfigs,
                processData: false,
                contentType: false,
                dataType: "json",
                beforeSend: function () {
                    uploading = true;
                },
                success: function (data) {
                    uploading = false;
                }
            });
            let $detectionLibSelection = $("#detectionLibSelection");
            $detectionLibSelection.empty();
            $detectionLibSelection.append($("<div></div>").attr({
                "class": "btn btn-outline-primary",
                "role": "button",
            }).text(autoDetectionLibSelection + " : " + autoDetectionLanguage));

        }
    });
}

$("#changeDetectionLib").on("click", function () {
    $("#languageSelectionModal").modal("hide");
    $("#programmingLanguageChoosingModal").modal("show");
});

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

function fileUploaded() {
    $("#uploadFileCheck").empty();
    $("#uploadFileCheck").append("<i class='material-icons'>check</i> File uploaded.");
}

function folderUploaded() {
    $("#uploadFolderCheck").empty();
    $("#uploadFolderCheck").append("<i class='material-icons'>check</i> Folder uploaded. <i>" + numberOfSubmissions + " submissions</i>");
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
        beforeSend: function(){
            uploading = true;
        },
        success: function (data) {
            uploading = false;
            setFileDetectionPackage();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.warn("Error sending the file");
            alert("Error: file not uploaded");
        }
    });

    $(document).ajaxStop(function() {
        fileUploaded();
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
            numberOfSubmissions = data;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.warn("Error sending the file");
            alert("Error: folder not uploaded");
        }
    });

    $(document).ajaxStop(function() {
        folderUploaded();
    });
}

function openNextButton() {
    if (uploadFileFinish && uploadFolderFinish) {
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
        fileUploaded();
    }

    if (folderPathList[0] != "NOFOLDEREXISTS") {
        modifyDOMAfterUploadingFolder();
        folderUploaded();
    }
    openNextButton();
    console.log('document.ready()')
});
