// Set name and other global variables, Django variables for this page
pageName = "Results";

//------------------------Print original segments------------------------
let segmentFilesKeys = Object.keys(segmentFiles).filter(key => segmentFiles.hasOwnProperty(key) === true).map(key =>{
    let originalCodeSegmentHeader = $("<div class='card-header'></div>").text(key);
    let originalCodeSegmentBody = $("<div class='card-body text-secondary'></div>");
    let originalCodeSegmentBodyPara = $("<p class='card-text'></p>");
    let originalCodeSegmentBodyParaPre = $("<pre></pre>").text(segmentFiles[key]);
});
/* for (let key in segmentFiles) {
    if (segmentFiles.hasOwnProperty(key)) segmentFilesKeys.push(key);
}

segmentFilesKeys.map(key =>{
    let originalCodeSegmentHeader = $("<div class='card-header'></div>").text(segmentFilesKeys[i]);
    let originalCodeSegmentBody = $("<div class='card-body text-secondary'></div>");
    let originalCodeSegmentBodyPara = $("<p class='card-text'></p>");
    let originalCodeSegmentBodyParaPre = $("<pre></pre>").text(segmentFiles[key]);
})
*/


for (var i = 0; i < segmentFilesKeys.length; i++) { 
    let originalCodeSegmentHeader = $("<div class='card-header'></div>").text(segmentFilesKeys[i]);

    let originalCodeSegmentBody = $("<div class='card-body text-secondary'></div>");
    let originalCodeSegmentBodyPara = $("<p class='card-text'></p>");
    let originalCodeSegmentBodyParaPre = $("<pre></pre>").text(segmentFiles[segmentFilesKeys[i]]);

    

    originalCodeSegmentBodyPara.appendChild(originalCodeSegmentBodyParaPre);
    originalCodeSegmentBody.appendChild(originalCodeSegmentBodyPara);

    document.getElementById("segmentDisplayBox").appendChild(originalCodeSegmentHeader);
    document.getElementById("segmentDisplayBox").appendChild(originalCodeSegmentBody);
}

//------------------------Print segments details------------------------
var jPlagResultsKeys = [];
for (var key in jPlagResults) {
    if (jPlagResults.hasOwnProperty(key)) jPlagResultsKeys.push(key);
}

document.getElementById("segmentDetailsDisplayBox").innerHTML = "";

jPlagSubmissionNumber -= segmentFilesKeys.length;
let individual_probabilities = [];
let joint_probability = 1;
let expectation = 0;

//------------------------Calculation part------------------------
for (let i = 0; i < jPlagResultsKeys.length; i++) {
    let temp_probability = Object.keys(jPlagResults[jPlagResultsKeys[i]]).length / (jPlagSubmissionNumber - 1)
    individual_probabilities.push(temp_probability);
    joint_probability *= temp_probability;
}

expectation = joint_probability * (jPlagSubmissionNumber - 1);

for (let i = 0; i < jPlagResultsKeys.length; i++) { 
    // Print individual probability, joint probability and joint expectation
    let codeSegmentHeader = document.createElement("div");
    codeSegmentHeader.setAttribute("class", "card-header");
    codeSegmentHeader.innerHTML = jPlagResultsKeys[i];

    let codeSegmentBody = document.createElement("div");
    codeSegmentBody.setAttribute("class", "card-body text-secondary");
    let codeSegmentBodyIndi = document.createElement("p");
    codeSegmentBodyIndi.setAttribute("class", "card-text");
    codeSegmentBodyIndi.innerHTML = "Individual Probabilities: " + individual_probabilities[i].toString();
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

    let suspectFilesKeys = [];
    for (let key in jPlagResults[jPlagResultsKeys[i]]) {
        if (jPlagResults[jPlagResultsKeys[i]].hasOwnProperty(key)) suspectFilesKeys.push(key);
    }

    if (suspectFilesKeys.length != 0) {
        document.getElementById("segmentDetailsDisplayBox").appendChild(document.createElement("hr"));

        for (let j = 0; j < suspectFilesKeys.length; j++) { 
            const filePath = suspectFilesKeys[j];
            const fileLink = jPlagResults[jPlagResultsKeys[i]][suspectFilesKeys[j]][1];

            let linkToJPlagResult = document.createElement("a");
            linkToJPlagResult.setAttribute("href", "details\\" + fileLink);
            linkToJPlagResult.innerHTML = filePath;
            linkToJPlagResult.appendChild(document.createElement("br"));

            document.getElementById("segmentDetailsDisplayBox").appendChild(linkToJPlagResult);
        }
    }
}