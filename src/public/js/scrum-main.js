window.$ = window.jQuery = require("../public/js/jquery3.5.2.js");

const { remote } = require("electron");
const { conn, status, session, LOG } = remote.require('./index.js'); // getting the DB connection
const { redirect, isObjectEmpty } = require('../public/js/helper-functions.js');


// ==================== VARIABLES =========================
const PROJECT_STATISTICS = '../views/partials/project-statistics.html';
const SIDE_BAR = "#sidebarCollapse";

const DYNAMIC_SCRIPTS_FOR_TEMPLATE = {
    "statistics": "../public/js/statistics/statistics-main.js",
    "planing_backlog": "path",
    "planing_sprint": "path",
    "sprint_board": "path",
    "sprint_task": "path",
    "queries": "path",
};

// ==================== FUNTION DEFITIONS =========================

/**
 * This function set the height of the side var to the max for the windows
 */
function fullHeight() {

    $('.js-fullheight').css('height', $(window).height());
    $(window).resize(function() {
        $('.js-fullheight').css('height', $(window).height());
    });
};

/**
 * Load dynamic js depending the template loaded
 * @param {String} templateName - name of the template {statistics, board, sprint}
 */
function loadScriptForTemplate(templateName) {

    LOG.info(":: scrum-main::loadScriptForTemplate ==> loading dynamic script");

    // if the template name is not in the object, load the default
    if (!(templateName in DYNAMIC_SCRIPTS_FOR_TEMPLATE)) {
        // TODO: notify the user
        LOG.error(":: scrum-main::loadScriptForTemplate ==> Invalid template name");
        return;
    }

    // loading the scrit dynamically
    let myScriptHtml = document.createElement("script");
    myScriptHtml.setAttribute("src", DYNAMIC_SCRIPTS_FOR_TEMPLATE[templateName]);
    document.body.appendChild(myScriptHtml);
}

/**
 * load the modal dynamically
 * @param {String} filePath 
 */
function loadModal(filePath) {
    $("#content").load(filePath, function() {
        //loadProjectStatus();
        let templateName = Object.keys(DYNAMIC_SCRIPTS_FOR_TEMPLATE);

        loadScriptForTemplate(templateName[0]);
    });
}

// ================================================================


$(document).ready(async function() {

    // set the side var to full heigth
    fullHeight();

    // load statistic modal since is the default one
    loadModal(PROJECT_STATISTICS);

    // TOGGLE THE SIDEVAR 
    $(SIDE_BAR).on('click', function() {
        $('#sidebar').toggleClass('active');
    });
});