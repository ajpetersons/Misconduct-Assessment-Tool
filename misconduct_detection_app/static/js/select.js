// Local sharing variables defined here
let maxSegmentNumber = 0;
let firstCall = true; // print hint on selection box

let horizontalSpace = "&nbsp;";
let verticalSpace = "<br/>";

/**
 * Used for lightening a color
 * @param color (HEX)
 * @param percent
 * @returns light colour
 */
function shadeColor(color, percent) {

    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    var RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
}

/**
 * Check whether the segments section is empty
 */
function areSegmentsEmpty() {
    let i;
    for (i = 1; i <= maxSegmentNumber; i++) {
        if ($("#rowSegment" + i).length)
            return false;
    }
    return true;
}

/**
 * Disables next button if there are no segments
 */
function updateNextButtonStatus() {
    if (areSegmentsEmpty()) {
        $("#nextButton").addClass("disabled")
    } else {
        $("#nextButton").removeClass("disabled")
    }
}

function getHighlightColour(segmentNumber) {
    return highLighterColors[segmentNumber % highLighterColors.length];
}

function redrawAccordingToBottomBar() {
    if (segmentsPathList !== "NOFOLDEREXISTS") {
        $("#segmentDisplayBox").empty();
        firstCall = false;
        
        let selectedSegmentsKeys = Object.keys(selectedSegments).filter(key => selectedSegments.hasOwnProperty(key) === true);

        // Find max so that the segments are going to be printed sorted
        let maxSegment = 0;
        selectedSegmentsKeys.forEach(selectedSegmentsKey => {
            let currentSegment = selectedSegmentsKey.substring("Segment_".length);
            let currentNumber = parseInt(currentSegment);
            if (maxSegment < currentNumber) maxSegment = currentNumber;
        });

        let i;
        for (i = 1; i <= maxSegment; i++) {
            let selectedSegmentsKey = "Segment_" + i;
            if (selectedSegmentsKey in selectedSegments) {
                drawOneSegment(selectedSegments[selectedSegmentsKey], i);
            }
        }
        maxSegmentNumber = maxSegment;
        updateNextButtonStatus();
    }
}

function redrawBottomBar() {
    $("#segmentsPathList").empty();
    const icon = "view_list";
    if (areSegmentsEmpty()) {
        let button = createButtonWithIcon(icon, "No segments selected", true);
        $("#segmentsPathList").append(button);
    } else {
        let link = "/select/";
        let button = createButtonWithIcon(icon, "Selected segments", false, link, false);
        $("#segmentsPathList").append(button);
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
    }).text(selectText);
    /* TODO: Experimental change with lines
    let codeSegment = $("<pre></pre>").attr({
        "class": "prettyprint linenums lang-c lang-cpp lang-java",
        "id": "inputText" + maxSegmentNumber,
        "style": "white-space:pre-wrap",
        "name": "Segment_" + maxSegmentNumber
    }).text(selectText);
    */
    // Create header
    // Header link
    let codeSegmentHeaderLink = $("<a></a>").attr({
        "href": "#highLightedSegment" + segmentNumber,
        "class": "h3"
    }).text("Segment " + segmentNumber);
    // Buttons
    let appendHeaderButton = $("<button></button>").attr({
        "class": "btn btn-light border border-dark btn-sm append-header-button",
        "id": "appendHeaderButton" + segmentNumber,
        "data-toggle": "tooltip",
        "data-placement": "top",
        "title": "Append selection",
    }).append("<i class='material-icons'>add</i>");
    let deleteHeaderButton = $("<button></button>").attr({
        "class": "btn btn-light border border-dark btn-sm delete-header-button",
        "id": "deleteHeaderButton" + segmentNumber,
        "data-toggle": "tooltip",
        "data-placement": "top",
        "title": "Delete segment",
    }).append("<i class='material-icons'>clear</i>");
    let includeHeaderCheckbox = $("<label>Include: </label>").attr({
        "class": "btn btn-light border border-dark btn-sm include-header-button",
        "style": "width: 100px;height: 39px;font-size: 18px;margin-top: 5%;",
        "id": "includeHeaderButton" + segmentNumber,
        "data-toggle": "tooltip",
        "data-placement": "top",
        "title": "Include segment in estimation"
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
    }).append(appendHeaderButton, horizontalSpace,
        deleteHeaderButton, horizontalSpace,
        includeHeaderCheckbox);

    // Header text
    let codeSegmentHeader = $("<div></div>").attr({
        "class": 'card-header',
        "style": 'background: ' + getHighlightColour(segmentNumber),
        "id": "highLightedSegmentHeader" + segmentNumber,
    }).append(codeSegmentHeaderLink, codeSegmentHeaderButtons);

    // Card body (segment code)
    let codeSegmentDiv = $("<div></div>").attr({
        "class": "card-body text-secondary",
        "style": 'background: ' + shadeColor(getHighlightColour(segmentNumber), 20),
        "id": "highLightedSegmentBody" + segmentNumber,
    }).append(codeSegment);

    // Card border
    let segmentBorder = $("<div></div>").attr({
        "class": 'card border-secondary',
        "style": 'background: ' + getHighlightColour(segmentNumber),
        "id": "highLightedSegmentBorder" + segmentNumber,
    }).append(codeSegmentHeader, codeSegmentDiv);

    // Card row
    let segmentRow = $("<row></row>").attr({
        "id": "rowSegment" + segmentNumber,
    }).append(segmentBorder);

    $("#segmentDisplayBox").append(segmentRow, verticalSpace);

    // Activate the tooltips
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
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
    }).get();
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
    console.log('codeDisplayHtml '+codeDisplayHtml)
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

function highlightNode(node, colour) {
    node.find("span").css("color", "black");
    node.find("span").css("background", colour);
}

function removeHighlight(masterNode) {
    masterNode.find("span").css("color", "");
    masterNode.find("span").css("background", "");
}

function highLightOriginalText(selectedTextRange, startNode, endNode, segmentNumber) {
    // Set the link
    let highlightLink = document.createElement("a");
    //highlightLink.setAttribute("style", "color: black; background: " + highLighterColors[maxSegmentNumber % highLighterColors.length]);
    highlightLink.setAttribute("href", "#highLightedSegmentHeader" + segmentNumber);
    highlightLink.setAttribute("id", "highLightedSegment" + segmentNumber);
    selectedTextRange.surroundContents(highlightLink);
    // Highlight the lines
    let currentNode = $(startNode);
    endNode = $(endNode);
    while (currentNode[0] !== endNode[0]) {
        highlightNode(currentNode, getHighlightColour(segmentNumber));
        currentNode = currentNode.next();
    }
    highlightNode(endNode, getHighlightColour(segmentNumber));
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
                    "You have not set the detection package and programming language!"
                )
                $('#autoDetectionConfirmationModal').modal('show');
            } else if ((detectionLibSelection != autoDetectionLibSelection) || detectionLanguage != autoDetectionLanguage) {
                $("#autoDetectionConfirmationModalBody").empty()
                $("#autoDetectionConfirmationModalConfirm").removeClass("disabled")
                $("#autoDetectionConfirmationModalBody").append(
                    `The selected programming language used for detection is not the one 
                    usually associated with the file extension of the uploaded file.
                    Recommended setting: <br> <br>`
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

function setCodeText(code) {
    $("#codeDisplayText").empty()
        .append("<pre id='codeDisplayTextPre' class='prettyprint linenums lang-c lang-cpp lang-java' style='white-space:pre-wrap'></pre>");
    $("#codeDisplayTextPre").text(code);
    PR.prettyPrint();
}

function setCodeDisplayText() {
    $.ajax({
        url: '/select/loadHtml/',
        type: "GET",
        dataType: "json",
        success: function (loadedHtml) {
            if (loadedHtml === "FILE_NOT_FOUND") {
                setCodeText(codeToCompare);
            } else {
                //console.log(loadedHtml);
                $("#codeDisplayText").empty();
                $("#codeDisplayText").html(loadedHtml);
            }
        }
    });
}

$("#nextButton").click(function(evt) {
    evt.preventDefault();

    if (!areSegmentsEmpty()) {
        sendCurrentSegmentsAndSelection();
        getAutoDetectionResults();
    }

});

function saveChanges() {
    // Save segment changes
    sendCurrentSegmentsAndSelection();
    $(document).ajaxStop(function () {
        redrawBottomBar();
    });
}

// Find the selected range of lines from the prettified code
function findSelectedRange(selectedText) {
    let startNode = $(selectedText.anchorNode).closest("li")[0];
    let endNode = $(selectedText.focusNode).closest("li")[0];

    // Check if the start node is after the end node (Case of selecting from the bottom)
    if ($("li").index(startNode) > $("li").index(endNode)) {
        // Swap them
        let tempNode = startNode;
        startNode = endNode;
        endNode = tempNode;
    }

    let range = document.createRange();
    range.setStartBefore(startNode);
    range.setEndAfter(endNode);
    selectedText.setBaseAndExtent(startNode, 0, endNode, endNode.childElementCount);
    return [range, startNode, endNode, selectedText];
}

function getSelectionRange() {
    let selectTextSelection = window.getSelection();
    return findSelectedRange(selectTextSelection);
}

function isAlpha(ch) {
    return /^[A-Z]$/i.test(ch);
}

/**
 * Checks that the selected text is more than 4 lines of code
 * @param selectedText
 */
function checkSelectedText(selectedText) {
    // Lines that have code in them (don't start with a symbol of comment)
    let lineCount = 0;
    // Separate the segment into lines
    let linesAll = selectedText.split("\n");
    linesAll.forEach(line => {
        line = line.trim();
        if (line && isAlpha(line[0])) {
            lineCount++;
        }
    });
    return lineCount > 4;
}

// Popover for small segments (dismiss on next click)
$('.popover-dismiss').popover({
    trigger: 'focus'
});

function displayTooltip() {
    let $codeDisplay = $("#codeDisplay");
    $codeDisplay.tooltip('enable');
    $codeDisplay.tooltip('show');
    $codeDisplay.tooltip('disable');
    // Color the border for 5 seconds
    $codeDisplay.addClass('border border-danger');
    let timer = setTimeout(function () {
        // reset border
        $codeDisplay.removeClass('border border-danger');
    }, 5000); // time in miliseconds, so 5s = 5000ms
}

function addSelectedSegment() {
    // Remove the reminder
    if (firstCall) {
        $("#segmentDisplayBox").empty();
        firstCall = false;
    }

    // Get the selected segment and add it
    let selectionRange;
    try {
        selectionRange = getSelectionRange();
    } catch (e) {
        // User didn't select anything
        displayTooltip();
        return;
    }
    let selectedTextRange = selectionRange[0];
    let startNode = selectionRange[1];
    let endNode = selectionRange[2];
    let selection = selectionRange[3];
    let selectedText = selection.toString();
    if (checkSelectedText(selectedText)) {
        maxSegmentNumber++;
        maxSegmentNumber = parseInt(maxSegmentNumber);
        highLightOriginalText(selectedTextRange, startNode, endNode, maxSegmentNumber);
        drawOneSegment(selectedText, maxSegmentNumber);
        saveChanges();
        updateNextButtonStatus();
    } else {
        displayTooltip();
    }


}

$("#addSegmentButtonBig").click(addSelectedSegment);
$("#addSegmentButtonSmall").click(addSelectedSegment);

$("#segmentDisplayBox").on("click", ".append-header-button", function (evt){
    let currentSegmentNumber = evt.currentTarget.id.substring("appendHeaderButton".length);
    let selectionRange = getSelectionRange();
    let selectedTextRange = selectionRange[0];
    let startNode = selectionRange[1];
    let endNode = selectionRange[2];
    let selection = selectionRange[3];
    let selectedText = selection.toString();
    if (selectedText !== "") {
        highLightOriginalText(selectedTextRange, startNode, endNode, currentSegmentNumber);

        let $inputText = $("#inputText" + currentSegmentNumber);
        let originalText = $inputText.text();
        $inputText.text(originalText
            //+ "\n\n====== ADDITION ======\n\n"
            + "\n\n\n" + selectedText);
    }

    saveChanges();

});

$("#segmentDisplayBox").on("click", ".delete-header-button", function (evt){
    let currentSegmentNumber = evt.currentTarget.id.substring("deleteHeaderButton".length);
    let $row = $("#rowSegment" + currentSegmentNumber);
    // Remove the line change
    $row.next("br").remove();
    // Remove the segment row
    $row.remove();
    removeHighlight($("#highLightedSegment" + currentSegmentNumber));
    document.getElementById("highLightedSegment" + currentSegmentNumber).outerHTML =
        document.getElementById("highLightedSegment" + currentSegmentNumber).innerHTML;

    saveChanges();
    updateNextButtonStatus();
});

$(document).ready(function () {
    // Set name and Django variables for this page
    pageName = "Select suspect segments";
    setCodeDisplayText();

    // Display selected segments if there is any
    redrawAccordingToBottomBar();
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
    $(function () {
        $('[data-toggle="popover"]').popover()
    });
});