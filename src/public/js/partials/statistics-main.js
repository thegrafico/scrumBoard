// // ==================== FUNTION DEFITIONS =========================

// /**
//  * get general information of the project
//  * @param {Number} projectId - Id of the current project
//  * @returns {Object} project information
//  */
// function getProjectInfo(projectId) {
//   return new Promise(async function (resolve, reject) {
//     // validation of the project
//     if (projectId == undefined || isNaN(projectId) || projectId == -1) {
//       LOG.error(
//         ":: scrum-main::getProjectInfo ==> Invalid project id: " + projectId
//       );
//       return reject("Invalid parameter: " + projectId);
//     }

//     let project = await conn.getProjectInfoById(projectId).catch((error) => {
//       LOG.error(
//         ":: scrum-main::getProjectInfo ==> Error getting the project from the db: " +
//           error
//       );
//       reject(error);
//     });

//     resolve(project[0]);
//   });
// }

// /**
//  * Load the project to the html
//  * @param {Object} project - project data
//  */
// function loadProjectToHtml(project) {
//   $(tagOwnerName).text("Raul Pichardo");
//   $(tagProjectName).text(project["name"]);
//   $(tagStartDate).text(project["date_created"]);
//   $(tagCurrentSprint).text(" Sprint 1");
//   $(projectDescription).text(project["description"]);
// }

// /**
//  * load the modal dynamically
//  * @param {String} filePath
//  */
// function statistics_load_model(filePath) {
//   $("#content").load(filePath, function () {
//     loadProjectStatus();
//   });
// }

// /**
//  * Change the status of the project
//  */
// function changeProjectStatus() {
//   $("body").on("click", ".status-item", function () {
//     // get the text of the btn pressed
//     let txt = $(this).text();

//     // change the text of the current status
//     $(tagCurrentStatus).text(txt);

//     // close all options
//     $(tagBtnToggleStatus).click();
//   });
// }
// ================================================================

$(document).ready(async function () {

    LOG.info("Dynamic script::statustucs-main.js was loaded");
    
    // init a new class Statistics base
    CURRENT_CLASS = new Statistics(conn, getProjectId());
    
    // load the project status
    if (!CURRENT_CLASS.loadProjectToHtml(status)){
        LOG.error("statistcs-main.js:: error loading the project status");
        rediret();
    }



    // event to change the status of the project
    $("body").on("click", CURRENT_CLASS.getBtnId("statusItem"), function(){
        
        // add to record, so we can remove it later 
        CURRENT_CLASS.addEvent('click', CURRENT_CLASS.getBtnId("statusItem"));

        // get the status the user click
        let clickedStatus = $(this).text();

        // change the main status
        $(CURRENT_CLASS.getTagId("currentStatus")).text(clickedStatus);

        // close the UI element
        $(CURRENT_CLASS.getBtnId("toggleStatus")).click();

        // logging the message
        LOG.info("statistics-main.js:: status changed");


        // TODO: enable button to save the current status to the database
    });

//   // load statistic modal since is the default one
//   statistics_load_model(PROJECT_STATISTICS);

//   // change the status of the project
//   changeProjectStatus();

//   // ==============   GETTING PROJECT INFO ==============

//   // get the project id using the ssessions
//   const projectId = getProjectId();

//   // get the project information
//   const projectInfo = await getProjectInfo(projectId).catch((e) => {
//     // TODO: notify the user of error
//     console.log("Error getting the project info: ", e);
//     LOG.error(
//       ":: scrum-main::ready ==> Error getting the project information: " + e
//     );
//   });

//   // verify is the project has information
//   if (isObjectEmpty(projectInfo)) {
//     // TODO: NOTIFY THE USER
//     LOG.error(":: scrum-main::ready ==> Project has not information");
//     console.log("Project is empty");
//     redirect(); // default redirect
//   }

//   // console.log("Project info: ", projectInfo);

//   // load the project info to html
//   loadProjectToHtml(projectInfo);

  // ====================================================
});
