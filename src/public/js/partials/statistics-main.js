/**
 * Statistics-main.js:
 * Last updated date: 11/14/2020
 * This file is in charge of all functionalities for statistics page
 */

$(document).ready(async function () {
  LOG.info("Dynamic script::statustucs-main.js was loaded");

  // init a new class Statistics base
  CURRENT_CLASS = new Statistics(conn, getProjectId());

  // load the project status
  if (!CURRENT_CLASS.loadProjectToHtml(status)) {
    LOG.error("statistcs-main.js:: error loading the project status");
    rediret();
  }

  // add to record, so we can remove it later
  CURRENT_CLASS.addEvent("click", CURRENT_CLASS.getBtnId("statusItem"));
  // event to change the status of the project
  $("body").on("click", CURRENT_CLASS.getBtnId("statusItem"), function () {
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
});
