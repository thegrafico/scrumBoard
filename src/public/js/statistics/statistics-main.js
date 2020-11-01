// ==================== VARIABLES =========================

const ADD_USER_BTN = "#addUserBtn";
const REMOVE_USER_BTN = "#removeUserBtn";
const VIEW_PERFORMANCE_BTN = "#viewPerformancesBtn";

// tags for the card project
const tagProjectName = "#projectName";
const tagOwnerName = "#ownerName";
const tagStatusList = "#statusMenu";
const tagCurrentStatus = "#currentStatus";
const tagBtnToggleStatus = "#btnToggleStatus";
const tagStartDate = "#startDate";
const tagCurrentSprint = '#currentSprint';

const PROJECT_STATISTICS = '../views/partials/project-statistics.html';


// ==================== FUNTION DEFITIONS =========================

/**
 * get general information of the project
 * @param {Number} projectId - Id of the current project
 * @returns {Object} project information 
 */
function getProjectInfo(projectId) {
    return new Promise(async function(resolve, reject) {

        // validation of the project 
        if (projectId == undefined || isNaN(projectId) || projectId == -1) {
            LOG.error(":: scrum-main::getProjectInfo ==> Invalid project id: " + projectId);
            return reject("Invalid parameter: " + projectId);
        }

        let project = await conn.getProjectInfoById(projectId).catch(error => {
            LOG.error(":: scrum-main::getProjectInfo ==> Error getting the project from the db: " + error);
            reject(error);
        });

        resolve(project[0]);
    });
}

/**
 * Return the project id
 */
function getProjectId() {

    // get the projetId 
    let projectId = session.get("currenProjectId");

    // redirect if there is not project
    if (projectId == -1) { redirect(); return; }

    return projectId;
}


/**
 * Load the project to the html
 * @param {Object} project - project data 
 */
function loadProjectToHtml(project) {

    $(tagOwnerName).text("Raul Pichardo");
    $(tagProjectName).text(project["name"]);
    $(tagStartDate).text(project["date_created"]);
    $(tagCurrentSprint).text(" Sprint 1");
    $(projectDescription).text(project["description"]);


}

/**
 * load the modal dynamically
 * @param {String} filePath 
 */
function loadModal(filePath) {
    $("#content").load(filePath, function() {
        loadProjectStatus();
    });
}

/**
 * Load the status of the project
 */
function loadProjectStatus() {

    $(tagCurrentStatus).text(status.project_status[0]);

    for (indx in status.project_status) {
        let mStatus = status.project_status[indx];

        $(tagStatusList).append(`<li>  <a class='status-item' href='#'>${mStatus}</a>  </li>`);
    }
}

/**
 * Change the status of the project 
 */
function changeProjectStatus() {

    $('body').on('click', '.status-item', function() {
        // get the text of the btn pressed
        let txt = $(this).text();

        // change the text of the current status
        $(tagCurrentStatus).text(txt);

        // close all options 
        $(tagBtnToggleStatus).click();
    });
}
// ================================================================


$(document).ready(async function() {

    // load statistic modal since is the default one
    loadModal(PROJECT_STATISTICS);

    // change the status of the project
    changeProjectStatus();

    // ==============   GETTING PROJECT INFO ==============

    // get the project id using the ssessions
    const projectId = getProjectId();

    // get the project information
    const projectInfo = await getProjectInfo(projectId).catch(e => {
        // TODO: notify the user of error
        console.log("Error getting the project info: ", e);
        LOG.error(":: scrum-main::ready ==> Error getting the project information: " + e);
    });


    // verify is the project has information
    if (isObjectEmpty(projectInfo)) {
        // TODO: NOTIFY THE USER
        LOG.error(":: scrum-main::ready ==> Project has not information");
        console.log("Project is empty");
        redirect(); // default redirect 
    }

    // console.log(projectInfo);

    // load the project info to html
    loadProjectToHtml(projectInfo);

    // ====================================================
});