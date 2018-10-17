// Set name and other global variables, Django variables for this page
pageName = "Results";

$("#segmentDetailsDisplayBox").on("click", ".showDetailsButton", function (evt){
    jPlagResultsKey = evt.currentTarget.id;

    $("#codeDetails" + jPlagResultsKey).toggle();
    $(this).toggleClass("btn-outline-secondary");
});

$(document).ready(function (){
    /*
    Here I built the following structure by pure javascript rather than jQuery. This is because 
    jQuery is not easy to use under this situation. If later jQuery is updated and a new way is
    provided by jQuery, please rewrite these following parts.
    */

    //------------------------Print original segments------------------------
    let segmentFilesKeys = Object.keys(segmentFiles).filter(key => segmentFiles.hasOwnProperty(key) === true);

    segmentFilesKeys.map(segmentFilesKey =>{ 
        let originalCodeSegmentHeader = document.createElement("div");
        originalCodeSegmentHeader.setAttribute("class", "card-header");
        originalCodeSegmentHeader.innerHTML = segmentFilesKey;

        let originalCodeSegmentBody = document.createElement("div");
        originalCodeSegmentBody.setAttribute("class", "card-body text-secondary");
        let originalCodeSegmentBodyPara = document.createElement("p");
        originalCodeSegmentBodyPara.setAttribute("class", "card-text");
        let originalCodeSegmentBodyParaPre = document.createElement("pre");
        originalCodeSegmentBodyParaPre.innerHTML = segmentFiles[segmentFilesKey];

        originalCodeSegmentBodyPara.appendChild(originalCodeSegmentBodyParaPre);
        originalCodeSegmentBody.appendChild(originalCodeSegmentBodyPara);

        document.getElementById("segmentDisplayBox").appendChild(originalCodeSegmentHeader);
        document.getElementById("segmentDisplayBox").appendChild(originalCodeSegmentBody);
    });

    //------------------------Print segments details------------------------
    let jPlagResultsKeys = Object.keys(jPlagResults).filter(key => jPlagResults.hasOwnProperty(key) === true);

    $("#segmentDetailsDisplayBox").empty();

    let individual_probabilities = [];
    let joint_probability = 1;
    let expectation = 0;

    //------------------------Calculation part------------------------
    jPlagResultsKeys.map(jPlagResultsKey => {
        let temp_probability = 0;
        if (Object.keys(jPlagResults[jPlagResultsKey]).length != 0) {
            temp_probability = (Object.keys(jPlagResults[jPlagResultsKey]).length - 1) / (jPlagSubmissionNumber - 1);
        }
        individual_probabilities[jPlagResultsKey] = temp_probability;
        joint_probability *= temp_probability;
    })

    expectation = joint_probability * (jPlagSubmissionNumber - 1);

    jPlagResultsKeys.map(jPlagResultsKey => { 
        // Print individual probability, joint probability and joint expectation
        let codeSegmentHeader = document.createElement("div");
        codeSegmentHeader.setAttribute("class", "card-header");
        codeSegmentHeader.innerHTML = jPlagResultsKey;

        let codeSegmentBody = document.createElement("div");
        codeSegmentBody.setAttribute("class", "card-body text-secondary");
        let codeSegmentBodyIndi = document.createElement("p");
        codeSegmentBodyIndi.setAttribute("class", "card-text");
        codeSegmentBodyIndi.innerHTML = "Individual Probability: " + individual_probabilities[jPlagResultsKey].toString();
        let codeSegmentBodyJoin = document.createElement("p");
        codeSegmentBodyJoin.setAttribute("class", "card-text");
        codeSegmentBodyJoin.innerHTML = "Joint Probability: " + joint_probability.toString();
        let codeSegmentBodyExp = document.createElement("p");
        codeSegmentBodyExp.setAttribute("class", "card-text");
        codeSegmentBodyExp.innerHTML = "Joint Expectation: " + expectation.toString();

        codeSegmentBody.appendChild(codeSegmentBodyIndi);
        codeSegmentBody.appendChild(codeSegmentBodyJoin);
        codeSegmentBody.appendChild(codeSegmentBodyExp);

        document.getElementById("segmentDetailsDisplayBox").appendChild(codeSegmentHeader);
        document.getElementById("segmentDetailsDisplayBox").appendChild(codeSegmentBody);

        // Print super link to original suspect code, if there is any.
        let suspectFilesKeys = Object.keys(jPlagResults[jPlagResultsKey]).filter(key => jPlagResults[jPlagResultsKey].hasOwnProperty(key) === true);
        
        if (suspectFilesKeys.length != 0) {
            $("#segmentDetailsDisplayBox").append($("<button></button>").attr({
                "class": "btn btn-outline-primary btn-sm showDetailsButton",
                "style": "width: 100px;margin-left: 1%;",
                "id": jPlagResultsKey,
            }).html("<i class='material-icons md-36'>info</i>"));
            $("#segmentDetailsDisplayBox").append("<hr>");
            $("#segmentDetailsDisplayBox").append($("<div></div>").attr({
                "id": "codeDetails" + jPlagResultsKey,
                "style": "display: none",
            }));

            suspectFilesKeys.map(suspectFilesKey => { 
                const filePath = suspectFilesKey.substring(suspectFilesKey.indexOf("folder") + 8);
                const fileLink = jPlagResults[jPlagResultsKey][suspectFilesKey][1];
                console.log(fileLink)
                let linkToJPlagResult = document.createElement("a");
                linkToJPlagResult.setAttribute("href", "details\\" + fileLink);
                linkToJPlagResult.setAttribute("target", "_blank");
                linkToJPlagResult.innerHTML = filePath;
                linkToJPlagResult.appendChild(document.createElement("br"));
        
                document.getElementById("codeDetails" + jPlagResultsKey).appendChild(linkToJPlagResult);
            });
        }
    })
});