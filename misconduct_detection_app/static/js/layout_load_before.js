//Loaded in layout.html (every page)

// NOTE: This patchy implementation from Xin is recommended to be refactored

function loadUploadedComparingFile() {
    // Format data
    fileToComparePathList = fileToComparePathList[0];

    if ($("#fileToComparePathList").length) {
        // Reset if existing
        $("#fileToComparePathList").empty();
    } else {
        // Add the File section to add the button
        // NOTE: this method was implemented by Xin
        // I suggest refactoring it to the HTML and being a consistent element
        $("#bottomBar").append("<div id='fileToComparePathList'></div>");
    }


    // If file exists, show the file. If not, show hint
    if (fileToComparePathList === "NOFOLDEREXISTS") {
        $("#fileToComparePathList").append($("<div></div>").attr({
            "class": "btn btn-outline-secondary disabled",
            "role": "button",
        }).text("No uploaded file"));
    } else {
        // console.log("DEBUG: FILE TO COMP "+ fileToComparePathList);
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
    if ($("#folderPathList").length) {
        // Reset if existing
        $("#folderPathList").empty();
    } else {
        // Add the File section to add the button
        // NOTE: this method was implemented by Xin
        // I suggest refactoring it to the HTML and being a consistent element
        $("#bottomBar").append("<div id='folderPathList'></div>");
    }

    // If folder exists, show the folder. If not, show hint
    if (folderPathList[0] === "NOFOLDEREXISTS") {
        $("#folderPathList").append($("<div></div>").attr({
            "class": "btn btn-outline-secondary disabled",
            "role": "button",
        }).text("No uploaded folder"));
    } else {

        $("#folderPathList").append($("<a></a>").attr({
            "class": "btn btn-outline-primary",
            "role": "button",
            "href": "/upload/uploadedFolder/",
            "target": "_blank",
        }).text("Uploaded Folder"));

        /* // Xin implementation as a popup
        $("#folderPathList").append($("<a></a>").attr({
            "tabindex": "0",
            "class": "btn btn-outline-primary",
            "role": "button",
            "data-toggle": "popover",
            "data-trigger": "focus",
            "data-placement": "top",
            "id": "folderPathListPopOver",
        }));
        // Create the up arrow
        $("#folderPathListPopOver").append("Uploaded Folder<i class='material-icons' style='position: relative;top: 4px;left: 0px;font-size: 18px;'>arrow_drop_up</i>");

        $("#hiddenContentsDiv").empty();
        folderPathList.forEach(filePath => {
            $("#hiddenContentsDiv").append($("<a></a>").attr({
                "href": "/examine/folders/" + filePath.substring(filePath.indexOf("folder") + 8),
                "target": "_blank",
            }).text(filePath.substring(filePath.indexOf("folder") + 8)));
            $("#hiddenContentsDiv").append("<br>");
        });
        // These popover functions must be put after above part since our DOMs
        // are built dynamically.
        $(function () {
            $("#folderPathListPopOver").popover({
                html: true,
                content: function() {
                    return $("#hiddenContentsDiv").html();
                },
            });
        });

        $(".popover-dismiss").popover({
            trigger: "focus"
        });
        */
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
        let linkToRes = $("<a></a>").attr({
            "href": "/select/",
            "class": "btn btn-outline-primary",
            "role": "button",
        }).text("Selected segments");
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
        let linkToRes = $("<a></a>").attr({
            "href": "/results/",
            "class": "btn btn-outline-primary",
            "role": "button",
        }).text("Last detection results");
        $("#resultsPathList").append(linkToRes);
    }
}

function loadDetectionLib() {
    // No need for formating
    $("#bottomBar").append("<div id='detectionLibSelection'></div>");

    // If detection lib selected, show the lib name. If not, show hint
    if (configsList === "NOFOLDEREXISTS") {
        $("#detectionLibSelection").append($("<div></div>").attr({
            "class": "btn btn-outline-secondary disabled",
            "role": "button",
        }).text("Detection library not selected"));
    } else {
        $("#detectionLibSelection").append($("<div></div>").attr({
            "class": "btn btn-outline-primary",
            "role": "button",
        }).text(detectionLibSelection + " : " + detectionLanguage));
    }

    // Construct the modal dynamically
    let detectionLibListKeys = Object.keys(detectionLibList).filter(key => detectionLibList.hasOwnProperty(key) === true);

    detectionLibListKeys.forEach(detectionLib => {
        $("#programmingLanguageChoosingDetectionLibForm").append(
            $("<input>").attr({
                "type": "radio",
                "name": "detectionLib",
                "id": "programmingLanguageChoosingDetectionLibForm" + detectionLib,
            }).val(detectionLib),
            $("<h7></h7>").text(" " + detectionLib),
            $("<br>"),
        );

        let detectionLibSupportedLanguages = Object.keys(detectionLibList[detectionLib]).filter(key => detectionLibList[detectionLib].hasOwnProperty(key) === true);

        // Adding supported languages for the detection lib. Hide them at first.
        $("#programmingLanguageChoosingLanguageFormDiv").append(
            $("<from></from>").attr({
                "id": "programmingLanguageChoosingLanguageFormDiv" + detectionLib,
                "class": "programmingLanguageChoosingLanguageFormDivs",
                "style": "display: none" ,
            })
        );

        detectionLibSupportedLanguages.forEach(detectionLibSupportedLanguage => {
            $("#programmingLanguageChoosingLanguageFormDiv" + detectionLib).append(
                $("<input>").attr({
                    "type": "radio",
                    "name": detectionLib,
                    "id": "programmingLanguageChoosingDetectionLibLanguageForm" + detectionLibSupportedLanguage,
                }).val(detectionLibList[detectionLib][detectionLibSupportedLanguage]),
                $("<h7></h7>").text(" " + detectionLibList[detectionLib][detectionLibSupportedLanguage]),
                $("<br>"),
            );
        });

        $("#programmingLanguageChoosingDetectionLibForm" + detectionLib).on("click", function(){
            $("#programmingLanguageChoosingLanguageFormGuide").empty();
            $(".programmingLanguageChoosingLanguageFormDivs").css("display", "none");
            $("#programmingLanguageChoosingLanguageFormDiv" + detectionLib).toggle();
        });
    });

    $("#programmingLanguageChoosingModalSave").on("click", function(){
        // Please notice here. Although we made all input radio button in a form,
        // we don't want to send it to the back-end directly. We will let something
        // else send the variables set here later.
        detectionLanguage = $("input[type='radio']:checked", ".programmingLanguageChoosingLanguageFormDivs").val()
        detectionLibSelection = $("input[name=detectionLib]:checked").val();
        if (detectionLanguage === undefined || detectionLibSelection === undefined) {
            console.error("Detection Library not properly selected")
            return;
        }
        console.warn(detectionLanguage, detectionLibSelection)

        $("#detectionLibSelection").empty();
        $("#detectionLibSelection").append($("<div></div>").attr({
            "class": "btn btn-outline-primary",
            "role": "button",
        }).text(detectionLibSelection + " : " + detectionLanguage));

        let programmingConfigs = new FormData();
        programmingConfigs.append("csrfmiddlewaretoken", document.getElementsByName('csrfmiddlewaretoken')[0].value);
        programmingConfigs.append("detectionLibSelection", detectionLibSelection);
        programmingConfigs.append("detectionLanguage", detectionLanguage);
        $.ajax({
            url: "/configs/savingConfigs/",
            type: 'POST',
            cache: false,
            data: programmingConfigs,
            processData: false,
            contentType: false,
            dataType:"json",
            beforeSend: function() {
                uploading = true;
            },
            success : function(data) {
                uploading = false;
            }
        });

        $(document).ajaxStop(function() {
            $("#programmingLanguageChoosingModal").modal('hide');
        });
        
    });

    // Let the button listen click event
    $("#detectionLibSelection").on("click", function() {
        $("#programmingLanguageChoosingModal").modal();
    });
}

$(document).ready(function (){
    // Load the elements in order
    loadUploadedComparingFile();
    loadUploadedFolder();
    loadSelectedSegments();
    loadResults();
    loadDetectionLib();
});