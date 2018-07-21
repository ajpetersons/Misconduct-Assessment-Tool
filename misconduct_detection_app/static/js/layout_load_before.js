function loadUploadedComparingFile() {
    // Format data
    fileToComparePathList = fileToComparePathList[0];
    $("#bottomBar").append("<div id='fileToComparePathList'></div>");

    // If file exists, show the file. If not, show hint
    if (fileToComparePathList === "NOFOLDEREXISTS") {
        $("#fileToComparePathList").append($("<div></div>").attr({
            "class": "btn btn-outline-secondary disabled",
            "role": "button",
        }).text("No uploaded file"));
    } else {
        let linkToFile = $("<a></a>").attr({
            "class": "btn btn-outline-primary",
            "role": "button",
            "href": "/examine/singlefiles/" + fileToComparePathList,
            "target": "_blank",
        }).text(fileToComparePathList);
        $("#fileToComparePathList").append(linkToFile);
    }
}

function loadUploadedFolder() {
    // No need for formating
    $("#bottomBar").append("<div id='folderPathList'></div>");

    // If folder exists, show the folder. If not, show hint
    if (folderPathList[0] === "NOFOLDEREXISTS") {
        $("#folderPathList").append($("<div></div>").attr({
            "class": "btn btn-outline-secondary disabled",
            "role": "button",
        }).text("No uploaded folder"));
    } else {
        $("#folderPathList").append($("<a></a>").attr({
            "tabindex": "0",
            "class": "btn btn-outline-primary",
            "role": "button",
            "data-toggle": "popover",
            "data-trigger": "focus",
            "data-placement": "top",
            "id": "folderPathListPopOver",
        }).text("Uploaded Folder"));

        folderPathList.map(filePath => {
            $("#hiddenContentsDiv").append($("<a></a>").attr({
                "href": "#"
            }).text(filePath.substring(filePath.indexOf("folder") + 8)));
            $("#hiddenContentsDiv").append("<br>");
        });
        // These popover functions must be put after above part since our DOM
        // is built dynamically.
        $(function () {
            $('#folderPathListPopOver').popover({
                html: true,
                content: function() {
                    return $('#hiddenContentsDiv').html();
                },
            });
        });

        $('.popover-dismiss').popover({
            trigger: 'focus'
        });
    }
}

function loadSelectedSegments() {
    // Format data
    segmentsPathList = segmentsPathList[0]
    $("#bottomBar").append("<div id='segmentsPathList'></div>");

    // If segment selections exist, show the link to result page. If not, show hint
    if (segmentsPathList === "NOFOLDEREXISTS") {
        $("#segmentsPathList").append($("<div></div>").attr({
            "class": "btn btn-outline-secondary disabled",
            "role": "button",
        }).text("No segments to show"));
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
        $("#resultsPathList").append($("<div></div>").attr({
            "class": "btn btn-outline-secondary disabled",
            "role": "button",
        }).text("No results to show"));
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
        $("#detectionLibSelection").append($("<div></div>").attr({
            "class": "btn btn-outline-secondary disabled",
            "role": "button",
        }).text("No detection library"));
    } else {
        $("#detectionLibSelection").append($("<div></div>").attr({
            "class": "btn btn-outline-primary",
            "role": "button",
        }).text(detectionLibSelection));
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