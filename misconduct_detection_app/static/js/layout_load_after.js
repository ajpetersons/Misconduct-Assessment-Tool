// Loaded in layout.html (every page)

// Cancel button considered a form (hidden)

$("#cancelButtonFinal").click(function () {
    csrfToken = new FormData($('#cancelButtonFrom')[0]);
    $.ajax({
        url: "/clean/",
        type: 'POST',
        cache: false,
        data: csrfToken,
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
        window.location.replace('/');
    });
});

$(document).ready(function (){
    $("#layoutHeader").text(pageName);
    $("#title").text(toolName + " -- " + pageName);
    $("#layoutToolName").text(toolName);
});