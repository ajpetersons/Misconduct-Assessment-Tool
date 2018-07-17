function loadUploadedComparingFile() {
    // Format data
    fileToComparePathList = fileToComparePathList[0];
    $("#bottomBar").append("<div id='fileToComparePathList'>Uploaded File: </div>");

    // If file exists, show the file. If not, show hint
    if (fileToComparePathList === "NOFOLDEREXISTS") {
        $("#fileToComparePathList").append("No uploaded compare file");
    } else {
        let linkToFile = $("<a></a>").attr({
            "href": "examine/singlefiles/" + fileToComparePathList
        }).text(fileToComparePathList);
        $("#fileToComparePathList").append(linkToFile);
    }
}

function loadUploadedFolder() {
    // No need for formating
    $("#bottomBar").append("<div id='folderPathList'>Uploaded Folder: </div>");

    // If folder exists, show the folder. If not, show hint
    if (folderPathList[0] === "NOFOLDEREXISTS") {
        $("#folderPathList").append("No uploaded folder");
    } else {
        let linkToFile = $("<a></a>").attr({
            "href": "examine/singlefiles/" + folderPathList
        }).text("folderPathList");
        $("#folderPathList").append(linkToFile);
    }
}

function loadSelectedSegments() {
    // Format data
    segmentsPathList = segmentsPathList[0]
    $("#bottomBar").append("<div id='segmentsPathList'></div>");

    // If segment selections exist, show the link to result page. If not, show hint
    if (segmentsPathList === "NOFOLDEREXISTS") {
        $("#segmentsPathList").append("No segments selection to show");
    } else {
        let linkToRes = $("<a href='#'></a>").text("Check last segment choice");
        $("#segmentsPathList").append(linkToRes);
    }
}

function loadResults() {
    // Format data
    resultsPathList = resultsPathList[0];
    $("#bottomBar").append("<div id='resultsPathList'></div>");

    // If results exist, show the link to result page. If not, show hint
    if (resultsPathList === "NOFOLDEREXISTS") {
        $("#resultsPathList").append("No results to show");
    } else if (resultsPathList === "RESULTSEXISTS"){
        let linkToRes = $("<a href='#'></a>").text("Check results from last detection");
        $("#resultsPathList").append(linkToRes);
    }
}

function loadDetectionLib() {
    // No need for formating
    $("#bottomBar").append("<div id='detectionLibSelection'></div>");

    // If detection lib selected, show the lib name. If not, show hint
    if (detectionLibSelection === "") {
        $("#detectionLibSelection").append("No detection library");
    } else {
        $("#detectionLibSelection").append("Some detection library");
    }
}

$(document).ready(function (){
    // Load the elements in order
    loadUploadedComparingFile();
    loadUploadedFolder();
    loadSelectedSegments();
    loadResults();
    loadDetectionLib();
});