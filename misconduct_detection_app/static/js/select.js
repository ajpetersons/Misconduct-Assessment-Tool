// Set name and other global variables, Django variables for this page
pageName = "Selection";
document.getElementById("codeDisplayText").innerHTML = code;
var segmentNumber = 0;
var firstCall = true;

document.getElementById("selectCode_Label").onclick = function() {
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
    
    document.getElementById("nextButton").removeAttribute("disabled");
}


document.onmouseup = document.getElementById("codeDisplayText").ondbclick= function(){
    /*
    TODO: Support multiple browser here
    */

    // var txt;
    // if(document.selection){
    //     txt = document.selection.createRange().text
    // }else{
    //     txt = window.getSelection()+'';
    // }
    // if(txt){alert(txt)}

    // TODO: Deselect example here.
    // if (window.getSelection) {
    //     if (window.getSelection().empty) {  // Chrome
    //         window.getSelection().empty();
    //     } else if (window.getSelection().removeAllRanges) {  // Firefox
    //         window.getSelection().removeAllRanges();
    //     }
    //     } else if (document.selection) {  // IE?
    //     document.selection.empty();
    // }

    // var selObj = window.getSelection(); 
    // if(selObj != ""){alert(selObj);}
    // var selRange = selObj.getRangeAt(0);
    // do stuff with the range
}

document.getElementById("addSegment").onclick = function() {
    if (firstCall) {
        document.getElementById("segmentDisplayBox").innerHTML = "";
        firstCall = false;
    }
    var selectText = window.getSelection(); 
    if(selectText != ""){
        segmentNumber++;
        var codeSegmentHeader = document.createElement("div");
        codeSegmentHeader.setAttribute("class", "card-header")
        codeSegmentHeader.innerHTML = "Segment " + segmentNumber;
        
        var codeSegmentDiv = document.createElement("div");
        codeSegmentDiv.setAttribute("class", "card-body text-secondary");

        var codeSegment = document.createElement("textarea");
        codeSegment.setAttribute("class", "form-control");
        codeSegment.setAttribute("id", "inputText");
        codeSegment.setAttribute("rows", "10");
        codeSegment.setAttribute("name", "Segment_" + segmentNumber);
        codeSegment.setAttribute("form", "selectCode_Form");
        codeSegment.setAttribute("readonly", "readonly");
        codeSegment.innerHTML = selectText;

        codeSegmentDiv.appendChild(codeSegment);
        document.getElementById("segmentDisplayBox").appendChild(codeSegmentHeader);
        document.getElementById("segmentDisplayBox").appendChild(codeSegmentDiv);

    }
}