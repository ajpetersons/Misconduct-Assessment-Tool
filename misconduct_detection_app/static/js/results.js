// Set name and other global variables, Django variables for this page
pageName = "Results";

// Precision of results
const decimalPrecision = 5;

var individual_probabilities = [];
var joint_probability = 1;
var expectation = 0;

var correctedSubmissionNumber;

let filesWithAllSegments;

isFileIncludedBool = isFileIncluded === "Yes";

if (isFileIncludedBool) {
    correctedSubmissionNumber = jPlagSubmissionNumber - 1;
} else {
    correctedSubmissionNumber = jPlagSubmissionNumber;
}

// Compute details
var jPlagResultsKeys = Object.keys(jPlagResults).filter(key => jPlagResults.hasOwnProperty(key) === true);
jPlagResultsKeys.forEach(jPlagResultsKey => {
    let temp_probability = 0;
    if (Object.keys(jPlagResults[jPlagResultsKey]).length !== 0) {
        let number_of_similar;
        if (isFileIncludedBool) {
            number_of_similar = Object.keys(jPlagResults[jPlagResultsKey]).length - 1;
        } else {
            number_of_similar = Object.keys(jPlagResults[jPlagResultsKey]).length;
        }
        temp_probability = number_of_similar / correctedSubmissionNumber;
    }
    individual_probabilities[jPlagResultsKey] = temp_probability;
    joint_probability *= temp_probability;
});

expectation = joint_probability * correctedSubmissionNumber;


var segmentFilesKeys = Object.keys(segmentFiles).filter(key => segmentFiles.hasOwnProperty(key) === true);
// Find the max segment
var maxSegment = 0;
var file_end = "";
segmentFilesKeys.forEach(segmentKey => {
    let currentSegment = segmentKey.substring("Segment_".length).split('.').slice(0, -1).join('.');
    let currentNumber = parseInt(currentSegment);
    if (maxSegment < currentNumber) maxSegment = currentNumber;
    file_end = segmentKey.split('.').slice(-1).join('.');
});


$("#report-form").submit(function (e) {
    // Prevent page refresh
    e.preventDefault();
    // Gather Form data
    var studentName = $("#student-name").val();
    var studentSurname = $("#student-surname").val();
    var studentMatriculation = $("#student-matriculation").val();
    var courseName = $("#course-name").val();
    var coursework = $("#coursework").val();
    var reportNotes = $("#report-notes").val();
    var segmentDetailed = $("#report-form input[name=segmentRadios]:checked").val();

    var detailed = segmentDetailed === "detailed";

    if(studentMatriculation === ""){
        return;
    }

    var doc = new jsPDF();

    var page_height = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    console.log(`Page Height: ${page_height}`);
    var page_width = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    console.log(`Page Width: ${page_width}`);
    var v_margin = 20;
    var h_margin = 10;
    //Drawing coordinates
    var y = v_margin;
    var x = h_margin;
    const line_width = page_width - (h_margin * 2);
    var vspace = 10;
    var line_height = 12; // mm
    var font_size = 12;
    var title_size = 36;
    var section_size = 16;
    var subsection_size = 12;
    var text_size = 8.5;
    // Used for the footer
    var current_page = 1;

    // Separate sections by drawing a line
    var separate_sections = function () {
        doc.line(x, y, line_width+h_margin, y);
        y += vspace;
    };

    // Switches fond size
    var change_font_size = function (size) {
        font_size = size;
        doc.setFontSize(font_size)
    };

    // Adds a footer to the bottom of the page
    var add_footer = function () {
        // Page #

        let str = "Page " + current_page;
        current_page++;

        orig_font_size = font_size;
        change_font_size(subsection_size);

        doc.text(page_width / 2, page_height - 10, str, 'center');

        change_font_size(orig_font_size);

    };

    // Prints text with automatic line spacing and page change
    var print_text = function (text, html=false) {
        if (y > page_height - v_margin) {
            add_footer();
            // Change page
            y = v_margin;
            doc.addPage();
        }
        if(!html){
            // Normal text
            doc.text(x, y, text);
        }else{
            doc.fromHTML(text, x, y);
        }

        y += font_size / 2;
    };

    // Prints texts with automatic line change
    var print_long_text = function (long_text){
        split_text = doc.splitTextToSize(long_text, line_width);
        for (let i = 0; i < split_text.length; i++) {
            print_text(split_text[i]);
        }
    };

    //Title
    change_font_size(title_size);
    doc.text(x, y, 'Academic Miscoduct Report');
    y += font_size / 2;
    separate_sections();

    // Form data in pdf
    change_font_size(section_size);
    if (studentName !== "" || studentSurname !== "") {
        if (studentMatriculation === "") {
            print_text(`Student: ${studentName} ${studentSurname}`);
        } else {
            print_text(`Student: ${studentName} ${studentSurname} (${studentMatriculation})`);
        }
    } else if (studentMatriculation !== "") {
        print_text(`Student Matriculation Number: ${studentMatriculation}`)
    }

    if (courseName !== "") {
        print_text(`Course: ${courseName}`)
    }

    if (coursework !== "") {
        print_text(`Coursework: ${coursework}`)
    }

    separate_sections();

    change_font_size(section_size);
    print_text("Introduction");
    change_font_size(text_size);
    print_long_text("This report is produced by the Misconduct Assessment Tool produced within the School of Informatics, University of Edinburgh.")
    y +=2;
    print_long_text("The aim of this tool is to test student submissions that are not obvious cases, but suspected of misconduct due to multiple small segments being similar to other submissions. With a large number of submissions, it is fairly likely that some segments will be similar by chance. This tool is used to help in such situations, by estimating the expected number of submissions with that exact combination of segments. It is built to assist the decision making process,")

    //Print the italics
    doc.setFontType("italic");
    x = 49;
    y -= font_size / 2;
    print_long_text(" it does not replace it.");
    x = h_margin;
    doc.setFontType("normal");

    y +=2;
    print_long_text("For each suspect segment, the individual probability of that segment is calculated by taking the number of submissions that have a similar segment over the number of all the submissions. Segments that are present in a lot of submissions have a higher individual probability. The joint probability is then calculated by assuming that each segment is independent and taking the product of all the segments' individual probabilities. Finally, to calculate the estimated number of submissions we take the joint probability and multiply it with the number of all the submissions. The resulting number should be the number of students anticipated to have the exact combination of the suspected segments. If the expected number is lower than one, a case of misconduct is suggested. Please note that the results are not conclusive.");
    //y +=3;
    //print_long_text("The Misconduct Assessment Tool has been created by Stelios Milisavljevic & Yuechen Xie under the supervision of Prof. Kyriakos Kalorkoti.")
    //print_text("School of Informatics, The University of Edinburgh");
    separate_sections();

    // Notes Section
    change_font_size(section_size);
    if (reportNotes !== "") {
        let orig_font_size = font_size;
        print_text(`Notes:`);
        y -= 2;
        change_font_size(text_size);
        print_long_text(reportNotes);
        font_size = orig_font_size;
        separate_sections();
    }

    // General Evaluation
    change_font_size(section_size);
    print_text("General Evaluation");
    change_font_size(subsection_size+1);
    print_text(`Number of total submissions:   ${jPlagSubmissionNumber}`);
    change_font_size(text_size);

    y -= 2;
    print_text(`Including the suspect submission: ${isFileIncluded}`);
    y += 3;

    y += 1;
    change_font_size(subsection_size + 1);
    print_text(`Student's questionable segments`);
    change_font_size(subsection_size);
    print_text(`Joint Probability:     ${joint_probability.toFixed(decimalPrecision)}`);
    print_text(`Joint Expectation:   ${expectation.toFixed(decimalPrecision)}`);
    change_font_size(text_size);
    if(expectation>1){
        print_long_text("A joint expectation > 1 suggests at least one student is anticipated to have this combination of segments.");
    }else{
        print_long_text("A joint expectation < 1 suggests no student is anticipated to have this combination of segments.");
    }

    // Submission with the same segment
    if (filesWithAllSegments !== undefined && filesWithAllSegments.size > 0) {
        y += 3;
        change_font_size(subsection_size);
        print_text(`Submissions containing all of the segments:`);
        y -= 1;
        change_font_size(text_size);
        filesWithAllSegments.forEach(suspectFilesKey => {
            const filePath = suspectFilesKey.substring(suspectFilesKey.indexOf("folder") + 8);
            print_long_text(filePath);
        });

    }

    separate_sections();
    // Segments section creation
    let i;
    for (i = 1; i <= maxSegment; i++) {
        let segmentFilesKey = "Segment_" + i + "." + file_end;
        if (!(segmentFilesKey in segmentFiles)) {
            continue;
        }
        // Get rid of the file extension (Segment name)
        let segmentName = segmentFilesKey.split('.').slice(0, -1).join('.');

        change_font_size(section_size);
        //print_text(segmentFilesKey);
        print_text(segmentName.replace("_", " "));
        change_font_size(subsection_size);
        print_text(`Individual probability:               ${individual_probabilities[segmentName].toFixed(decimalPrecision)}`);
        change_font_size(subsection_size-1);
        let suspectFilesKeys = Object.keys(jPlagResults[segmentName]).filter(key => jPlagResults[segmentName].hasOwnProperty(key) === true);
        let similarSubmissionNumber = suspectFilesKeys.length - 1;
        if (similarSubmissionNumber < 0) similarSubmissionNumber = 0;
        print_text(`Number of similar submissions:   ${similarSubmissionNumber}`);
        y += 1;
        change_font_size(text_size);
        if(detailed) {
            // Detailed form adds segment code
            print_long_text(segmentFiles[segmentFilesKey]);
        }
        separate_sections();
        //y +=10;
    }

    // Add final page footer
    add_footer();

    // Optional - set properties on the document
    doc.setProperties({
        title: 'Academic Misconduct Assessment Report',
        subject: '',
        author: 'Misconduct Detection Project',
        keywords: 'misconduct, academic, assessment, report',
        creator: 'Misconduct Assessment Tool: Report generation created by Stelios Milisavljevic s1509375 (University of Edinburgh School of Informatics)'
    });
    doc.output('dataurlnewwindow');
});

$(document).ready(function (){

    // Populate results page

    // General stats
    $("#segmentsContainer").before(
        "<div id='results-summary'>" +
        `<h4>Number of total submissions: <i>${jPlagSubmissionNumber}</i></h4>Including the suspect submission: ${isFileIncluded}` +
        `<p>Joint Probability: <i>${joint_probability.toFixed(decimalPrecision)}</i><br/>Joint Expectation: <i>${expectation.toFixed(decimalPrecision)}</i></p>` +
        "</div>"
    );

    // Each segment
    let i;
    for (i = 1; i <= maxSegment; i++) {
        let segmentFilesKey = "Segment_" + i + "." + file_end;
        if (!(segmentFilesKey in segmentFiles)) {
            continue;
        }
        // Get rid of the file extension (Segment name)
        let segmentName = segmentFilesKey.split('.').slice(0, -1).join('.');

        let segmentStructure = `<row id='row${segmentName}'>` +
            "<div class='card border-secondary'>" +
            `<div class='card-header'><h2>${segmentName.replace("_", " ")}</h2></div>` +
            "<div class='card-body text-secondary'>" +
            "<div class='row'>" +
            `<div class='col-12 col-xl-8' id='${segmentName}Code'></div>` +
            `<div class='col-12 col-xl-4' id='${segmentName}Details'></div>` +
            "</div>" +
            "</div>" +
            "</div>" +
            "</row>" +
            "<br/>";
        $("#segmentsContainer").append(segmentStructure);

        // Add the segment code
        let segmentCodeStructure = "<p class='card-text'>" +
            "<pre class='prettyprint linenums lang-c lang-cpp lang-java' style='white-space:pre-wrap'>" +
            segmentFiles[segmentFilesKey] +
            "</pre>" +
            "</p>";
        $(`#${segmentName}Code`).append(segmentCodeStructure);

        // Add the segment details
        let $segmentDetails = $(`#${segmentName}Details`);
        let jPlagResultsKey = segmentName;
        let segmentDetailsStructure = "<p class='card-text'>" +
            "Individual Probability: " + individual_probabilities[jPlagResultsKey].toFixed(decimalPrecision).toString() +
            "</p>";
        $segmentDetails.append(segmentDetailsStructure);

        // Link to original suspect code, if there is any.
        let suspectFilesKeys = Object.keys(jPlagResults[jPlagResultsKey]).filter(key => jPlagResults[jPlagResultsKey].hasOwnProperty(key) === true);

        if (suspectFilesKeys.length !== 0) {
            $segmentDetails.append($("<button></button>").attr({
                "class": "btn btn-outline-primary btn-sm showDetailsButton",
                "style": "width: 100px;margin-left: 1%;",
                "id": jPlagResultsKey,
                "data-toggle": "tooltip",
                "data-placement": "top",
                "title": "Similar files detected"
            }).click(
                function () {
                    $("#codeDetails" + jPlagResultsKey).toggle();
                    $(this).toggleClass("btn-outline-secondary");
                }
            ).html("<i class='material-icons md-36'>info</i>"));
            $segmentDetails.append("<hr>");
            $segmentDetails.append($("<div></div>").attr({
                "id": "codeDetails" + jPlagResultsKey,
                "style": "display: none",
            }));

            // Links to the similar files

            suspectFilesKeys.forEach(suspectFilesKey => {
                const filePath = suspectFilesKey.substring(suspectFilesKey.indexOf("folder") + 8);
                const fileLink = jPlagResults[jPlagResultsKey][suspectFilesKey][1];
                let linkToJPlagResult = document.createElement("a");
                linkToJPlagResult.setAttribute("href", "details\\" + fileLink);
                linkToJPlagResult.setAttribute("target", "_blank");
                linkToJPlagResult.innerHTML = filePath;
                linkToJPlagResult.appendChild(document.createElement("br"));

                document.getElementById("codeDetails" + jPlagResultsKey).appendChild(linkToJPlagResult);



            });

            // Determine if the files has the same segments as the suspect
            if(!filesWithAllSegments){
                // First call, initialize filesWithAllSegments
                filesWithAllSegments = new Set(suspectFilesKeys);
            }else{
                // Only include the files that also appear for this segment
                let currentSegmentFiles = new Set(suspectFilesKeys);
                filesWithAllSegments = new Set(
                    [...filesWithAllSegments].filter(x => currentSegmentFiles.has(x))
                );
            }
        }else{
            // No matching files for this segment, thus no file in general will have all the segments
            filesWithAllSegments = new Set();
        }

    }
    console.log(filesWithAllSegments);
    console.log(filesWithAllSegments.size> 0);
    let filesWithAllSegmentsElement = $("<div id='all-segments-same'></div>");
    if(filesWithAllSegments !== undefined && filesWithAllSegments.size>0){
        $("#results-summary").append("<h5>Submissions containing all of the segments:</h5>");

    }
    filesWithAllSegments.forEach(suspectFilesKey => {

        const filePath = suspectFilesKey.substring(suspectFilesKey.indexOf("folder") + 8);

        //$("#results-summary").append(`<p>${filePath}</p>`);
        filesWithAllSegmentsElement.append(`<i>${filePath}</i><br>`);
    });
    $("#results-summary").append(filesWithAllSegmentsElement.append("<br>"));
    PR.prettyPrint();

    // Enable tootips
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
    
});