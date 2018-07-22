// Local sharing variables defined here
let segmentNumber = 0;
let firstCall = true;

function highLightOriginalText(segmentNumber) {
    let selectedText = window.getSelection().getRangeAt(0);
    let highLighted = document.createElement("a");
    highLighted.setAttribute("style", "color: black; background: " + highLighterColors[segmentNumber % highLighterColors.length]);
    highLighted.setAttribute("id", "highLightedSegment" + (segmentNumber + 1));
    highLighted.setAttribute("href", "#highLightedSegmentHeader" + segmentNumber);
    selectedText.surroundContents(highLighted);
}

$("#nextButton").click(function(evt) {
    evt.preventDefault();

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

    $(document).ajaxStop(function() {
        window.location.replace('/select/runningWaitingPage/');
    });
});

$("#addSegmentButton").click(function() {
    // Remove the reminder
    if (firstCall) {
        $("#segmentDisplayBox").empty();
        firstCall = false;
    }

    // Get the selected segment and add it
    let selectText = window.getSelection(); 
    if(selectText != "") {
        highLightOriginalText(segmentNumber);
        segmentNumber++;

        // Create inner segment text
        let codeSegment = $("<textarea></textarea>").attr({
            "class": "form-control",
            "id": "inputText",
            "rows": "10",
            "form": "selectCode_Form",
            "readonly": "readonly",
            "name": "Segment_" + segmentNumber,
        }).text(selectText)

        // Create header
        // Header link
        let codeSegmentHeaderLink = $("<a></a>").attr({
            "href": "#highLightedSegment" + segmentNumber
        }).text("Segment " + segmentNumber);
        // Buttons
        let appendHeaderButton = $("<button></button>").attr({
            "class": "btn btn-outline-secondary btn-sm",
            "id": "appendHeaderButton" + segmentNumber,
        }).append("<i class='material-icons'>add</i>");
        let deleteHeaderButton = $("<button></button>").attr({
            "class": "btn btn-outline-secondary btn-sm",
            "id": "deleteHeaderButton" + segmentNumber,
        }).append("<i class='material-icons'>clear</i>");
        let includeHeaderButton = $("<button></button>").attr({
            "class": "btn btn-outline-secondary btn-sm",
            "id": "includeHeaderButton" + segmentNumber,
        }).append("<i class='material-icons'>report_off</i>");
        // Header button group
        let codeSegmentHeaderButtons = $("<div></div>").attr({
            "id": "highLightedSegmentHeaderButtons" + segmentNumber,
            "class": "highLightedSegmentHeaderButtons",
            "style": "float: right;display: inline;",
        }).append(appendHeaderButton, deleteHeaderButton, includeHeaderButton);
        // Header text
        let codeSegmentHeader = $("<div></div>").attr({
            "class": 'card-header',
            "style": 'background: ' + highLighterColors[(segmentNumber - 1) % highLighterColors.length],
            "id": "highLightedSegmentHeader" + segmentNumber,
        }).append(codeSegmentHeaderLink, codeSegmentHeaderButtons);
                
        // Wrapper
        let codeSegmentDiv = $("<div class='card-body text-secondary'></div>").append(codeSegment);
        $("#segmentDisplayBox").append(codeSegmentHeader, codeSegmentDiv);
    }
});

$("#saveSegmentButton").click(function(evt) {
    $("#saveSegmentButton").empty();
    $("#saveSegmentButton").append("<i class='fa fa-spinner fa-spin' style='font-size: 24px;'></i>");
    
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

    $(document).ajaxStop(function() {
        $("#saveSegmentButton").empty();
        $("#saveSegmentButton").append("<i class='material-icons'>save_alt</i>");
    });
});

$("#appendHeaderButton" + segmentNumber).on("click", ".highLightedSegmentHeaderButtons", function (){
    alert("button clicked");
});

$(document).ready(function (){
    // Set name and Django variables for this page
    pageName = "Selection";
    $("#codeDisplayText").empty().append("<code><pre id='codeDisplayTextPre' style='white-space:pre-wrap'></pre></code>");
    $("#codeDisplayTextPre").text(codeToCompare);
});