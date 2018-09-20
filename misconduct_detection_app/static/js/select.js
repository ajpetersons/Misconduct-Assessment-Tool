// Local sharing variables defined here
let segmentNumber = 0;
let firstCall = true; // print hint on selection box

function redrawAccordingToBottomBar() {
    if (segmentsPathList != "NOFOLDEREXISTS") {
        $("#segmentDisplayBox").empty();
        firstCall = false;
        
        let selectedSegmentsKeys = Object.keys(selectedSegments).filter(key => selectedSegments.hasOwnProperty(key) === true);
        selectedSegmentsKeys.map(selectedSegmentsKey => {
            segmentNumber = selectedSegmentsKey.substring(8);
            drawOneSegment(selectedSegments[selectedSegmentsKey], selectedSegmentsKey.substring(8));
        });
    }
}

function redrawBottomBar() {
    $("#segmentsPathList").empty();
    if (segmentNumber === 0) {
        $("#segmentsPathList").append($("<div></div>").attr({
            "class": "btn btn-outline-secondary disabled",
            "role": "button",
        }).text("No segments to show"));
    } else {
        let linkToRes = $("<a></a>").attr({
            'href': '/select/',
            "class": "btn btn-outline-primary",
            "role": "button",
        }).text("Check selected segments");
        $("#segmentsPathList").append(linkToRes);
    }
}

function drawOneSegment(selectText, segmentNumber) {
    // Create inner segment text
    let codeSegment = $("<textarea></textarea>").attr({
        "class": "form-control",
        "id": "inputText" + segmentNumber,
        "rows": "10",
        "form": "selectCode_Form",
        "readonly": "readonly",
        "name": "Segment_" + segmentNumber,
    }).text(selectText)

    // Create header
    // Header link
    let codeSegmentHeaderLink = $("<a></a>").attr({
        "href": "#highLightedSegment" + segmentNumber,
    }).text("Segment " + segmentNumber);
    // Buttons
    let appendHeaderButton = $("<button></button>").attr({
        "class": "btn btn-outline-secondary btn-sm append-header-button",
        "id": "appendHeaderButton" + segmentNumber,
    }).append("<i class='material-icons'>add</i>");
    let deleteHeaderButton = $("<button></button>").attr({
        "class": "btn btn-outline-secondary btn-sm delete-header-button",
        "id": "deleteHeaderButton" + segmentNumber,
    }).append("<i class='material-icons'>clear</i>");
    let includeHeaderCheckbox = $("<label>Include:</label>").attr({
        "class": "btn btn-outline-secondary btn-sm include-header-button",
        "style": "width: 100px;height: 39px;font-size: 18px;margin-top: 5%;",
        "id": "includeHeaderButton" + segmentNumber,
    }).append($("<input>").attr({
        "name": "includeHeaderCheckbox" + segmentNumber,
        "id": "includeHeaderCheckbox" + segmentNumber,
        "type": "checkbox",
        "value": segmentNumber,
        "required": "required",
        "checked": "checked",
    }));
    // Header button group
    let codeSegmentHeaderButtons = $("<div></div>").attr({
        "id": "highLightedSegmentHeaderButtons" + segmentNumber,
        "class": "highLightedSegmentHeaderButtons",
        "style": "float: right;display: inline;margin-top: -2%;",
    }).append(appendHeaderButton, deleteHeaderButton, includeHeaderCheckbox);
    // Header text
    let codeSegmentHeader = $("<div></div>").attr({
        "class": 'card-header',
        "style": 'background: ' + highLighterColors[(segmentNumber - 1) % highLighterColors.length],
        "id": "highLightedSegmentHeader" + segmentNumber,
    }).append(codeSegmentHeaderLink, codeSegmentHeaderButtons);
            
    // Wrapper
    let codeSegmentDiv = $("<div></div>").attr({
        "class": "card-body text-secondary",
        "id": "highLightedSegmentBody" + segmentNumber,
    }).append(codeSegment);
    $("#segmentDisplayBox").append(codeSegmentHeader, codeSegmentDiv);
    /*
    Here since our DOMs are created dynamically, the event handlers are slightly different
    from normal ones. You can find them below. 
    */
}

function sendCurrentSegmentsAndSelection() {
    let selectedCode = new FormData($('#selectCode_Form')[0]);
    $.ajax({
        url: "selectCode/",
        type: 'POST',
        cache: false,
        data: selectedCode,
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

    let checkedBoxesArray = $('input[type="checkbox"]:checked').map(function(){
		return $(this).val();
    }).get()
    let checkedBoxes = new FormData();
    checkedBoxes.append("csrfmiddlewaretoken", document.getElementsByName('csrfmiddlewaretoken')[0].value);
    checkedBoxes.append("checkedBox", checkedBoxesArray);
    $.ajax({
        url: "checkBoxStatus/",
        type: 'POST',
        cache: false,
        data: checkedBoxes,
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

    let codeDisplayHtml = $("#codeDisplayText").html()
    let codeDisplayFrom = new FormData();
    codeDisplayFrom.append("csrfmiddlewaretoken", document.getElementsByName('csrfmiddlewaretoken')[0].value);
    codeDisplayFrom.append("codeDisplayHtml", codeDisplayHtml);
    $.ajax({
        url: "saveHtml/",
        type: 'POST',
        cache: false,
        data: codeDisplayFrom,
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
}

function highLightOriginalText(selectedTextRange, segmentNumber) {
    let highLighted = document.createElement("a");
    highLighted.setAttribute("style", "color: black; background: " + highLighterColors[segmentNumber % highLighterColors.length]);
    highLighted.setAttribute("href", "#highLightedSegmentHeader" + segmentNumber);
    highLighted.setAttribute("id", "highLightedSegment" + (segmentNumber + 1));
    selectedTextRange.surroundContents(highLighted);
}

function getAutoDetectionResults() {
    $.ajax({
        url: '/select/autoDetect/',
        type: "GET",
        dataType: "json",
        success: function (autoDetectResults) {
            autoDetectionLibSelection = autoDetectResults[0]
            autoDetectionLanguage = autoDetectResults[1]
            if ((detectionLibSelection === undefined) || (detectionLanguage === undefined)) {
                $("#autoDetectionConfirmationModalBody").empty()
                $("#autoDetectionConfirmationModalConfirm").addClass("disabled")
                $("#autoDetectionConfirmationModalBody").append(
                    "You have not set your detection package and detecting proggramming language! <br> You have to go back and set one. <br>"
                )
                $('#autoDetectionConfirmationModal').modal('show');
            } else if ((detectionLibSelection != autoDetectionLibSelection) || detectionLanguage != autoDetectionLanguage) {
                $("#autoDetectionConfirmationModalBody").empty()
                $("#autoDetectionConfirmationModalConfirm").removeClass("disabled")
                $("#autoDetectionConfirmationModalBody").append(
                    `Your detection package settings are not optimal. 
                    Consider go back and modify your settings. <br>
                    If you insist using current settings, errors might be caused. <br>
                    Based on your uploaded file, we recommend you to use: <br> <br>`
                )
                $("#autoDetectionConfirmationModalBody").append($("<div></div>").attr({
                    "style": "text-align: center",
                }).text(autoDetectionLibSelection + " : " + autoDetectionLanguage));
                $("#autoDetectionConfirmationModalConfirm").on("click", function(){
                    window.location.replace('/select/runningWaitingPage/');
                });
                $('#autoDetectionConfirmationModal').modal('show');
            } else {
                $(document).ajaxStop(function() {
                    window.location.replace('/select/runningWaitingPage/');
                });
            }
        }
    });
}

function setCodeDisplayText() {
    $.ajax({
        url: '/select/loadHtml/',
        type: "GET",
        dataType: "json",
        success: function (loadedHtml) {
            if (loadedHtml === "FILE_NOT_FOUND") {
                $("#codeDisplayText").empty().append("<code><pre id='codeDisplayTextPre' style='white-space:pre-wrap'></pre></code>");
                $("#codeDisplayTextPre").text(codeToCompare);
            } else {
                console.log(loadedHtml);
                $("#codeDisplayText").empty();
                $("#codeDisplayText").html(loadedHtml);
            }
        }
    });
}

$("#nextButton").click(function(evt) {
    evt.preventDefault();

    sendCurrentSegmentsAndSelection();
    getAutoDetectionResults();
});

$("#addSegmentButton").click(function() {
    // Remove the reminder
    if (firstCall) {
        $("#segmentDisplayBox").empty();
        firstCall = false;
    }

    // Find appropriate segment number
    let i = 0;
    for (i; i < segmentNumber; i++) {
        let highLightedPart = document.getElementById("highLightedSegment" + (i + 1));
        if (highLightedPart) {
        } else {
            break;
        }
    }

    // Get the selected segment and add it
    let selectText = window.getSelection(); 
    let selectedTextRange = window.getSelection().getRangeAt(0);
    if(selectText != "") {
        segmentNumber = parseInt(segmentNumber);
        if (i === segmentNumber) {
            highLightOriginalText(selectedTextRange, segmentNumber);
            segmentNumber++;
            drawOneSegment(selectText, segmentNumber);
        } else {
            highLightOriginalText(selectedTextRange, i);
            i++;
            drawOneSegment(selectText, i);
        }

    }
});

$("#saveSegmentButton").click(function(evt) {
    $("#saveSegmentButton").empty();
    $("#saveSegmentButton").append("<i class='fa fa-spinner fa-spin' style='font-size: 24px;'></i>");
    
    sendCurrentSegmentsAndSelection();

    $(document).ajaxStop(function() {
        $("#saveSegmentButton").empty();
        $("#saveSegmentButton").append("<i class='material-icons'>save</i>");
        redrawBottomBar();
    });
});

$("#segmentDisplayBox").on("click", ".append-header-button", function (evt){
    let currentSegmentNumber = evt.currentTarget.id.substring(evt.currentTarget.id.length - 1);

    let selectText = window.getSelection(); 
    let selectedTextRange = window.getSelection().getRangeAt(0);
    if(selectText != "") {
        highLightOriginalText(selectedTextRange, currentSegmentNumber - 1);
    }
    let originalText = $("#inputText" + currentSegmentNumber).text()
    $("#inputText" + currentSegmentNumber).text(originalText
                                                + "\n\n========================New Part========================\n\n" 
                                                + selectText);
});

$("#segmentDisplayBox").on("click", ".delete-header-button", function (evt){
    let currentSegmentNumber = evt.currentTarget.id.substring(evt.currentTarget.id.length - 1);
    $("#highLightedSegmentBody" + currentSegmentNumber).remove();
    $("#highLightedSegmentHeader" + currentSegmentNumber).remove();
    document.getElementById("highLightedSegment" + currentSegmentNumber).outerHTML = document.getElementById("highLightedSegment" + currentSegmentNumber).innerHTML
});

$(document).ready(function () {
    // Set name and Django variables for this page
    pageName = "Selection";
    setCodeDisplayText();

    // Display selected segments if there is any
    redrawAccordingToBottomBar();
});