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
    document.getElementById("layoutHeader").innerHTML = pageName;
    document.getElementById("title").innerHTML = toolName + " -- " + pageName;
    document.getElementById("layoutToolName").innerHTML = toolName;
});