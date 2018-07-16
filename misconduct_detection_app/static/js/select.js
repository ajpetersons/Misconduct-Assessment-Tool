// Local sharing variables defined here
let segmentNumber = 0;
let firstCall = true;
let numberOfHighLighters = 22;

function highLightOriginalText(segmentNumber) {
    let selectedText = window.getSelection().getRangeAt(0);
    var newNode = document.createElement("span");
    newNode.setAttribute("style", "background: red");
    selectedText.surroundContents(newNode);
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

        let codeSegmentHeader = $("<div class='card-header'></div>").text("Segment " + segmentNumber);        
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