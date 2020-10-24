window.$ = window.jQuery = require("../public/js/jquery3.5.2.js")

const { remote } = require("electron");
const { conn, status, session, LOG } = remote.require('./index.js'); // getting the DB connection
const { redirect, isObjectEmpty } = require('../public/js/helper-functions.js');


// ==================== VARIABLES =========================





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

        resolve(project);

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

// ================================================================


$(document).ready(async function() {

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

    (function($) {

        "use strict";

        var fullHeight = function() {

            $('.js-fullheight').css('height', $(window).height());
            $(window).resize(function() {
                $('.js-fullheight').css('height', $(window).height());
            });

        };
        fullHeight();

        $('#sidebarCollapse').on('click', function() {
            $('#sidebar').toggleClass('active');
        });

    })(jQuery);

});