// $('#dynamic-content').load('file:///my-partial.html')
const { remote } = require("electron");
const { conn, status, session } = remote.require('./index.js'); // getting the DB connection


// ================== VARIABLES =========================
const boxProjectID = "#box-show-projects";
const NUMBER_OF_PROJECT_PER_ROW = 3;

// btn create id
const BTN_CREATE_MODAL = "#createModal";

// inputs from modal to create project
const modalProjectName = '#pName';
const modalProjectDesc = '#pDescription';


// variables for html template
const BOX_FATHER_HTML = "HTML";
const BOX_TEMPLATE_TITLE = "TITLE";
const BOX_TEMPLATE_DATE = "DATE";
const BOX_TEMPLATE_DESCRIPTION = "DESCRIPTION";
const BOX_TEMPLATE_STATUS = "STATUS";
const BOX_TEMPLATE_PROJECT_ID = "PROJECTID";

// html template to add a new project
let boxCardRowTemplate = `<div class="row"> ${BOX_FATHER_HTML} </div>`;
let boxCardTemplate = `
<div id='${BOX_TEMPLATE_PROJECT_ID}' class="col-3 card text-white bg-dark mb-6 card-project">
    
    <div class="card-header"> 
        <span class='card-title'> ${BOX_TEMPLATE_STATUS} </span> - <span class='card-date'>${BOX_TEMPLATE_DATE}</span>
    </div>

    <div class="card-body">
        <h4 class="card-title">${BOX_TEMPLATE_TITLE}</h4>
        <p class="card-text">${BOX_TEMPLATE_DESCRIPTION}</p>
    </div>
</div>`;

const REDIRECT_HTML = 'scrumMain.html';


// ====================================================

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

    let html = boxCardTemplate.replaceAll(BOX_TEMPLATE_TITLE, projectObject.title);
    html = html.replaceAll(BOX_TEMPLATE_PROJECT_ID, projectObject.id);
    html = html.replaceAll(BOX_TEMPLATE_DESCRIPTION, projectObject.description);
    html = html.replaceAll(BOX_TEMPLATE_DATE, projectObject.date);
    html = html.replaceAll(BOX_TEMPLATE_STATUS, projectObject.status);


    if (numberOfProjectsInROw >= NUMBER_OF_PROJECT_PER_ROW) {
        html = boxCardRowTemplate.replace(BOX_FATHER_HTML, html);

        $(boxProjectID).append(html);

    } else {
        $(boxProjectID).children().last().append(html);
    }

}

/**
 * @returns {Object} - {name, description}
 */
function getModalInput() {

    // TODO: validate the limits of the variables

    let pName = $(modalProjectName).val();
    let pDescription = $(modalProjectDesc).val();

    let params = [
        { var: pName, type: 's', canBeNull: false },
        { var: pDescription, type: 's', canBeNull: true }
    ];

    if (!conn._verifyParameters(params)) { return undefined };

    // since pDescription can be null
    if (pDescription != undefined) pDescription = pDescription.trim()

    return { name: pName.trim(), description: pDescription };
}

/**
 * Get the projects by the current user
 */
async function loadUserProjects() {

    // get projects
    let projects = await conn.getProjectsByUser().catch(err => {
        console.log(err);
    });

    // verify projects
    if (projects == undefined || projects.length == 0) {
        // TODO: NOTIFY THE USER the error
        return;
    }

    // iter throught all projects
    projects.forEach(project => {
        createProjectHtml({
            id: project["project_id"],
            title: project["name"],
            description: project["description"],
            date: project["date_created"],
            status: project["status"]
        });
    });


}


// LOGIG IS RUN HERE 
$(document).ready(function() {

    const viewsDir = session.get("projectDir");

    // path for modal create
    let createModalPath = '../views/partials/create-modal.html';

    // load the modal once the document is fully loaded
    loadModal(createModalPath);

    // load user projects
    loadUserProjects();

    // EVENT WHEN THE USER CREATED A NEW PROJECT
    $('body').on('click', BTN_CREATE_MODAL, async function() {

        // get the name and the description by the modal
        let { name, description } = getModalInput();

        let projectID = await conn.createProject(name, description).catch((error) => {
            // TODO: Notification to the user that there is an error
            console.log("ERROR: ", error);
        });

        if (projectID) {
            createProjectHtml({ id: projectID, title: name, description: description, date: conn._getDate(), status: status.new });
        } else {
            // TODO: notify the user the error
            console.log("Error creating the project");
        }
    });


    /**
     * This functions redirect to a project
     * When the user clicks the project it will load all information for that particular project
     */
    $("body").on("click", ".card-project", function() {

        // get project id
        const projectId = $(this).attr("id");

        // set the session of the project to load
        session.set("currenProjectId", projectId);

        // reditect to a page
        redirect(viewsDir + "/views/scrumMain.html");

    });

});