$("#detectionLibSelectionInput").val("Jplag");
detectionLibSelectionSubmit = new FormData($('#detectionLibSelectionForm')[0]);
$.ajax({
    url: "/select/running/",
    type: 'POST',
    cache: false,
    data: detectionLibSelectionSubmit,
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

$(document).ready(function () {
    // Set name and other global variables, Django variables for this page
    document.getElementById("title").innerHTML = "Please Wait...";

    // Clear body content
    var body = document.querySelector("body");
    body.innerHTML = "";

    // Create first h1 element and attach it
    body.appendChild(document.createElement("br"));
    var tempElement = document.createElement("h1");
    tempElement.style = "text-align: center";
    tempElement.innerHTML = "Please wait, the detection is in progress.";
    body.appendChild(tempElement);
    body.appendChild(document.createElement("br"));

    // Crate second h1 element and attach it
    tempElement = document.createElement("h1");
    tempElement.style = "text-align: center";
    tempElement.innerHTML = "This might take a few minutes.";
    body.appendChild(tempElement);

    // Crate the image and attach it
    body.appendChild(document.createElement("br"));
    tempElement = document.createElement("h1");
    tempElement.style = "text-align: center";
    var tempImage = document.createElement("i");
    tempImage.setAttribute("class", "fa fa-spinner fa-spin");
    tempImage.setAttribute("style", "font-size:68px");
    tempElement.appendChild(tempImage);
    body.appendChild(tempElement);

    // Redirect
    $(document).ajaxStop(function() {
        window.location.replace('/results/');
    });
});