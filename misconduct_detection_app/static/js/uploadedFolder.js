pageName = "Uploaded Folder Files";

// remove the elements not needed in the page like the bottom bar and the login form

$("#login-form-group").empty();
$("#bottomBar").remove();
$("#sidebar").remove();

folderPathList.forEach(filePath => {
    $("#filesList").append($("<a></a>").attr({
        "href": "/examine/folders/" + filePath.substring(filePath.indexOf("folder") + 8),
        "target": "_blank",
    }).text(filePath.substring(filePath.indexOf("folder") + 8)));
    $("#filesList").append("<br>");
});