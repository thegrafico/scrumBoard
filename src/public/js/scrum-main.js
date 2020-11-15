window.$ = window.jQuery = require("../public/js/jquery3.5.2.js");

const { remote } = require("electron");
const { conn, status, session, LOG } = remote.require("./index.js"); // getting the DB connection
const { redirect, isObjectEmpty } = require("../public/js/helper-functions.js");
const { Statistics } = require("../public/js/classes/classMain.js");

// ==================== VARIABLES =========================
const SIDE_BAR = "#sidebarCollapse";
const DYNAMIC_ID_FOR_TEMPLATE = "dynamicScript";
const DYNAMIC_CONTAINER = "#content";

let CURRENT_CLASS = undefined;

const DYNAMIC_TEMPLATE_SCRIPTS_FOR_TEMPLATE = {
  linkToStatistics: {
    view: "../views/partials/project-statistics.html",
    script: "../public/js/partials/statistics-main.js",
    class: Statistics,
  },
  linkToBacklog: {
    view: "../views/partials/project-backlog.html",
    script: "../public/js/partials/board-main.js",
    class: Statistics,
  },
  linkToSprintPlaning: {
    view: "../views/partials/project-sprint-planing.html",
    script: null,
    class: Statistics,
  },
  linkToBoard: {
    view: "../views/partials/project-sprint-board.html",
    script: null,
    class: Statistics,
  },
  linkToMyTask: {
    view: "../views/partials/project-sprint-my-task.html",
    script: null,
    class: Statistics,
  },
  linkToQueries: {
    view: "../views/partials/project-queries.html",
    script: null,
    class: Statistics,
  },
  linkToWiki: {
    view: "../views/partials/project-wiki.html",
    script: null,
    class: Statistics,
  },
};

// LINKS TO OTHER TEMPLATES
const linkToStatistics = "linkToStatistics";
const linkToBacklog = "linkToBacklog";
const linkToSprintPlaning = "linkToSprintPlaning";
const linkToBoard = "linkToBoard";
const linkToMyTask = "linkToMyTask";
const linkToQueries = "linkToQueries";
const linkToWiki = "linkToWiki";

// default template
let ACTIVE_TEMPLATE = linkToStatistics;

// change template btn
const CHANGE_TEMPLATE_BTN = ".urlBtn";

// ==================== FUNTION DEFITIONS =========================

/**
 * This function set the height of the side var to the max for the windows
 */
function fullHeight() {
  $(".js-fullheight").css("height", $(window).height());
  $(window).resize(function () {
    $(".js-fullheight").css("height", $(window).height());
  });
}

/**
 * Load dynamic js depending the template loaded
 * @param {String} templateName - name of the template {statistics, board, sprint}
 */
function loadScriptForTemplate(script) {
  // early exit condition
  if (!script) return;

  LOG.info(":: scrum-main::loadScriptForTemplate ==> loading dynamic script");

  // loading the scrit dynamically
  let myScriptHtml = document.createElement("script");

  // setting scripts
  myScriptHtml.setAttribute("src", script);
  myScriptHtml.setAttribute("id", DYNAMIC_ID_FOR_TEMPLATE);

  try {
    document.body.appendChild(myScriptHtml);
  } catch (error) {
    LOG.error(
      ":: scrum-main::loadScriptForTemplate ==> Error loading the dynamic script: " +
        error
    );
  }

  LOG.info(":: scrum-main::loadScriptForTemplate ==> Dynamic tab was loaded");
}

/**
 * Remove the dynamic template and script from the template
 */
function clearTemplate() {
  LOG.info(":: scrum-main::clearTemplate ==> Started removing template");

  // empty html
  if ($(DYNAMIC_CONTAINER).length) {
    $(DYNAMIC_CONTAINER).empty();
  }

  // remove script from html
  if ($(`#${DYNAMIC_ID_FOR_TEMPLATE}`).length) {
    console.log("Removing script...");
    // removing script from html
    $(`#${DYNAMIC_ID_FOR_TEMPLATE}`).remove();
  }

  if (CURRENT_CLASS != undefined){

    CURRENT_CLASS.unload();      
    LOG.info(": scrum-main::clearTemplate ==>  Class was sucessfully removed");
    delete CURRENT_CLASS;
    // CURRENT_CLASS = undefined;  
  }else {
    LOG.error(": scrum-main::clearTemplate ==> Error unloading the class");
  }
  LOG.info(":: scrum-main.js::clearTemplate ==> Finished removing template");
}

/**
 * load the modal dynamically
 * @param {String} url - template name
 */
function loadModal(url) {

	// get the view to be loaded
  let view = DYNAMIC_TEMPLATE_SCRIPTS_FOR_TEMPLATE[url]["view"];
	
	// get the dynamic script to be loaded
	let script = DYNAMIC_TEMPLATE_SCRIPTS_FOR_TEMPLATE[url]["script"];

  // load the container info
  $(DYNAMIC_CONTAINER).load(view, function () {
    if (script != null) {

      loadScriptForTemplate(script);
    }
  });
}

/**
 * This function is called from the dynamic loaded classes
 * Return the project id
 * @returns {Number} - id of the project
 */
function getProjectId() {
  // get the projetId
  let projectId = session.get("currenProjectId");

  // redirect if there is not project
  if (projectId == -1) {
		LOG.error("scrum-main.js::getProjectId --> Invalid Project ID");
    redirect();
    return;
  }

  return projectId;
}

// ================================================================

$(document).ready(async function () {
  
  // set the side var to full heigth
  fullHeight();

  // load statistic modal since is the default one
  loadModal(ACTIVE_TEMPLATE);

  // ============== LOAD DYNAMIC ================

  // change the template
  $(CHANGE_TEMPLATE_BTN).on("click", function () {
    
    // getting the template to load
    let templateId = $(this).attr("id");		
		
    // clean only if not is the active template
    if (ACTIVE_TEMPLATE != templateId) {
      
      // clean the class and remove all events listener
      clearTemplate();        

      loadModal(templateId);

			ACTIVE_TEMPLATE = templateId;
			LOG.info("EVENT::CHANGE_TEMPLATE_BTN --> Changed view to " + templateId);
    }
  });

  // ============================================

  // TOGGLE THE SIDEVAR
  $(SIDE_BAR).on("click", function () {
    $("#sidebar").toggleClass("active");
	});

	
});
