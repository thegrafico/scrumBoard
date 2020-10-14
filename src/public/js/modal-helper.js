// $('#dynamic-content').load('file:///my-partial.html')

const boxProjectID = "#box-show-projects";
const boxProjectInnerChild = ".row";
const NUMBER_OF_PROJECT_PER_ROW = 3;
const BOX_FATHER_HTML = "HTML";
const BOX_TEMPLATE_TITLE = "TITLE";
const BOX_TEMPLATE_DESCRIPTION = "DESCRIPTION";
const BTN_CREATE_MODAL = "#createModal";

let boxCarRowTemplate = `<div class="row"> HTML </div>`;
let boxCarTemplate = `
<div class="col-3 card text-white bg-dark mb-6">
    <div class="card-header">TITLE</div>
    <div class="card-body">
        <h4 class="card-title">TITLE</h4>
        <p class="card-text">DESCRIPTION</p>
    </div>
</div>`;



/**
 * load the modal dynamically
 * @param {String} filePath 
 */
function loadModal(filePath) {
    $("#myModal").load(filePath);
}

/**
 * create a html template with the project information
 * @param {Object} projectObject - keys {id, title, description}
 */
function createProjectHtml(projectObject) {

    // return null if object is empty
    if (projectObject == undefined || Object.keys(projectObject).length == 0) {
        return null;
    }

    // get last child of row
    let numberOfProjectsInROw = $(boxProjectID).children().last().children().length;
    // console.log("NUMBER OF ELEMENTS: ", numberOfProjectsInROw);

    let html = boxCarTemplate.replace(BOX_TEMPLATE_TITLE, projectObject.title);
    html = html.replace(BOX_TEMPLATE_DESCRIPTION, projectObject.description);

    if (numberOfProjectsInROw >= NUMBER_OF_PROJECT_PER_ROW) {
        html = boxCarRowTemplate.replace(BOX_FATHER_HTML, html);

        $(boxProjectID).append(html);

    } else {
        $(boxProjectID).children().last().append(html);
    }

}


$(document).ready(function() {

    // path for modal create
    let createModalPath = '../views/partials/create-modal.html';

    // load the modal once the document is fully loaded
    loadModal(createModalPath);

    $('body').on('click', BTN_CREATE_MODAL, function() {
        console.log("HERE");
        createProjectHtml({ id: "xxx", title: "blabla", description: "askdaskd" });
    });
});