window.$ = window.jQuery = require("../public/js/jquery3.5.2.js")

const { remote } = require("electron");
const { conn, status, session } = remote.require('./index.js'); // getting the DB connection


// ==================== FUNTION DEFITIONS =========================

/**
 * get general information of the project
 * @param {Number} projectId - Id of the current project
 * @returns {Object} project information 
 */
function getProjectInfo(projectId) {
    return new Promise(function(resolve, reject) {

        // validation of the project 
        if (projectId == undefined || isNaN(projectId)) {
            return reject("Invalid parameter");
        }


    });
}

// ================================================================


$(document).ready(async function() {

    const projectInfo = await getProjectInfo(session.get("projectId")).catch(e => {
        console.log("Error getting the project info: ", e);
    });

    if (projectInfo == undefined || typeof(projectInfo) != typeof({}) || Object.keys(projectInfo) == 0) {

    }
});