// Set name and other global variables, Django variables for this page
pageName = "Results";


$(document).ready(function (){
    //------------------------Print original segments------------------------
    let segmentFilesKeys = Object.keys(segmentFiles).filter(key => segmentFiles.hasOwnProperty(key) === true);

    segmentFilesKeys.map(segmentFilesKey =>{ 
        var originalCodeSegmentHeader = document.createElement("div");
        originalCodeSegmentHeader.setAttribute("class", "card-header");
        originalCodeSegmentHeader.innerHTML = segmentFilesKey;

        var originalCodeSegmentBody = document.createElement("div");
        originalCodeSegmentBody.setAttribute("class", "card-body text-secondary");
        var originalCodeSegmentBodyPara = document.createElement("p");
        originalCodeSegmentBodyPara.setAttribute("class", "card-text");
        var originalCodeSegmentBodyParaPre = document.createElement("pre");
        originalCodeSegmentBodyParaPre.innerHTML = segmentFiles[segmentFilesKey];

        originalCodeSegmentBodyPara.appendChild(originalCodeSegmentBodyParaPre);
        originalCodeSegmentBody.appendChild(originalCodeSegmentBodyPara);

        document.getElementById("segmentDisplayBox").appendChild(originalCodeSegmentHeader);
        document.getElementById("segmentDisplayBox").appendChild(originalCodeSegmentBody);
    });

    //------------------------Print segments details------------------------
    let jPlagResultsKeys = Object.keys(jPlagResults).filter(key => jPlagResults.hasOwnProperty(key) === true);

    $("#segmentDetailsDisplayBox").empty();

    jPlagSubmissionNumber -= segmentFilesKeys.length;
    let individual_probabilities = [];
    let joint_probability = 1;
    let expectation = 0;

    //------------------------Calculation part------------------------
    jPlagResultsKeys.map(jPlagResultsKey => {
        let temp_probability = Object.keys(jPlagResults[jPlagResultsKey]).length / (jPlagSubmissionNumber - 1)
        individual_probabilities.jPlagResultsKey = temp_probability;
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
        codeSegmentBodyIndi.innerHTML = "Individual Probabilities: " + individual_probabilities.jPlagResultsKey.toString();
        let codeSegmentBodyJoin = document.createElement("p");
        codeSegmentBodyJoin.setAttribute("class", "card-text");
        codeSegmentBodyJoin.innerHTML = "Joint Probabilities: " + joint_probability.toString();
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
            $("#segmentDetailsDisplayBox").append("<hr>");

            suspectFilesKeys.map(suspectFilesKey => { 
                const filePath = suspectFilesKey;
                const fileLink = jPlagResults[jPlagResultsKey][suspectFilesKey][1];

                let linkToJPlagResult = document.createElement("a");
                linkToJPlagResult.setAttribute("href", "details\\" + fileLink);
                linkToJPlagResult.innerHTML = filePath;
                linkToJPlagResult.appendChild(document.createElement("br"));

                document.getElementById("segmentDetailsDisplayBox").appendChild(linkToJPlagResult);
            });
        }
    })
});