// Local sharing variables defined here
let segmentNumber = 0;
let firstCall = true;

function highLightOriginalText(segmentNumber) {
    let selectedText = window.getSelection().getRangeAt(0);
    var highLighted = document.createElement("a");
    highLighted.setAttribute("style", "color: black; background: " + highLighterColors[segmentNumber % highLighterColors.length]);
    highLighted.setAttribute("id", "highLightedSegment-" + (segmentNumber + 1));
    highLighted.setAttribute("href", "#highLightedSegmentHeader-" + segmentNumber);
    selectedText.surroundContents(highLighted);
}

$("#nextButton").click(function(evt) {
    evt.preventDefault();

    selectedCode = new FormData($('#selectCode_Form')[0]);
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

$("#addSegment").click(function() {
    // Remove the reminder
    if (firstCall) {
        $("#segmentDisplayBox").empty();
        firstCall = false;
    }

    // Get the selected segment and add it
    let selectText = window.getSelection(); 
    if(selectText != ""){
        highLightOriginalText(segmentNumber);
        segmentNumber++;

        let codeSegment = $("<textarea></textarea>").attr({
            "class": "form-control",
            "id": "inputText",
            "rows": "10",
            "form": "selectCode_Form",
            "readonly": "readonly",
            "name": "Segment_" + segmentNumber,
        }).text(selectText)

        let codeSegmentHeaderLink = $("<a></a>").attr({
            "href": "#highLightedSegment-" + segmentNumber
        }).text("Segment " + segmentNumber);
        let codeSegmentHeader = $("<div></div>").attr({
            "class": 'card-header',
            "style": 'background: ' + highLighterColors[(segmentNumber - 1) % highLighterColors.length],
            "id": "highLightedSegmentHeader-" + segmentNumber,
        }).append(codeSegmentHeaderLink);
                
        let codeSegmentDiv = $("<div class='card-body text-secondary'></div>").append(codeSegment);

        $("#segmentDisplayBox").append(codeSegmentHeader, codeSegmentDiv);
    }
});

$(document).ready(function (){
    // Set name and Django variables for this page
    pageName = "Selection";
    $("#codeDisplayText").empty().append("<pre id='codeDisplayTextPre' style='white-space:pre-wrap'></pre>");
    $("#codeDisplayTextPre").text(codeToCompare);
});