pageName = "Results";

var segmentFilesKeys = [];
for (var key in segmentFiles) {
    if (segmentFiles.hasOwnProperty(key)) segmentFilesKeys.push(key);
}

for (var i = 0; i < segmentFilesKeys.length; i++) { 
    var originalCodeSegmentHeader = document.createElement("div");
    originalCodeSegmentHeader.setAttribute("class", "card-header");
    originalCodeSegmentHeader.innerHTML = segmentFilesKeys[i];

    var originalCodeSegmentBody = document.createElement("div");
    originalCodeSegmentBody.setAttribute("class", "card-body text-secondary");
    var originalCodeSegmentBodyPara = document.createElement("p");
    originalCodeSegmentBodyPara.setAttribute("class", "card-text");
    var originalCodeSegmentBodyParaPre = document.createElement("pre");
    originalCodeSegmentBodyParaPre.innerHTML = segmentFiles[segmentFilesKeys[i]];
    originalCodeSegmentBodyPara.appendChild(originalCodeSegmentBodyParaPre);
    originalCodeSegmentBody.appendChild(originalCodeSegmentBodyPara);

    document.getElementById("segmentDisplayBox").appendChild(originalCodeSegmentHeader);
    document.getElementById("segmentDisplayBox").appendChild(originalCodeSegmentBody);
}

var jPlagResultsKeys = [];
for (var key in jPlagResults) {
    if (jPlagResults.hasOwnProperty(key)) jPlagResultsKeys.push(key);
}

document.getElementById("segmentDetailsDisplayBox").innerHTML = "";

jPlagSubmissionNumber -= segmentFilesKeys.length;
var individual_probabilities = [];
var joint_probability = 1;
var expectation = 0;

for (var i = 0; i < jPlagResultsKeys.length; i++) {
    var temp_probability = Object.keys(jPlagResults[jPlagResultsKeys[i]]).length / (jPlagSubmissionNumber - 1)
    individual_probabilities.push(temp_probability);
    joint_probability *= temp_probability;
}

expectation = joint_probability * (jPlagSubmissionNumber - 1);

for (var i = 0; i < jPlagResultsKeys.length; i++) { 
    // Print individual probability, joint probability and joint expectation
    var codeSegmentHeader = document.createElement("div");
    codeSegmentHeader.setAttribute("class", "card-header");
    codeSegmentHeader.innerHTML = jPlagResultsKeys[i];

    var codeSegmentBody = document.createElement("div");
    codeSegmentBody.setAttribute("class", "card-body text-secondary");
    var codeSegmentBodyIndi = document.createElement("p");
    codeSegmentBodyIndi.setAttribute("class", "card-text");
    codeSegmentBodyIndi.innerHTML = "Individual Probabilities: " + individual_probabilities[i].toString();
    var codeSegmentBodyJoin = document.createElement("p");
    codeSegmentBodyJoin.setAttribute("class", "card-text");
    codeSegmentBodyJoin.innerHTML = "Joint Probabilities: " + joint_probability.toString();
    var codeSegmentBodyExp = document.createElement("p");
    codeSegmentBodyExp.setAttribute("class", "card-text");
    codeSegmentBodyExp.innerHTML = "Joint Expectation: " + expectation.toString();

    codeSegmentBody.appendChild(codeSegmentBodyIndi);
    codeSegmentBody.appendChild(codeSegmentBodyJoin);
    codeSegmentBody.appendChild(codeSegmentBodyExp);

    document.getElementById("segmentDetailsDisplayBox").appendChild(codeSegmentHeader);
    document.getElementById("segmentDetailsDisplayBox").appendChild(codeSegmentBody);

    // Print super link to original suspect code, if there is any.

    var suspectFilesKeys = [];
    for (var key in jPlagResults[jPlagResultsKeys[i]]) {
        if (jPlagResults[jPlagResultsKeys[i]].hasOwnProperty(key)) suspectFilesKeys.push(key);
    }

    if (suspectFilesKeys.length != 0) {
        document.getElementById("segmentDetailsDisplayBox").appendChild(document.createElement("hr"));

        for (var j = 0; j < suspectFilesKeys.length; j++) { 
            const filePath = jPlagResults[jPlagResultsKeys[i]][suspectFilesKeys[j]][1];

            var linkToJPlagResult = document.createElement("a");
            linkToJPlagResult.setAttribute("href", "details\\" + filePath);
            linkToJPlagResult.innerHTML = filePath;
            linkToJPlagResult.appendChild(document.createElement("br"));

            document.getElementById("segmentDetailsDisplayBox").appendChild(linkToJPlagResult);
        }
    }
}