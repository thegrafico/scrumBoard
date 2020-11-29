/**
 * Statistics-main.js:
 * Last updated date: 11/14/2020
 * This file is in charge of all functionalities for statistics page
 */

$(document).ready(async function () {
  LOG.info("Dynamic script::statustucs-main.js was loaded");

  // init a new class Statistics base
  CURRENT_CLASS = new Statistics(conn, getProjectId(), USER_NAME);

  // load the project status
  if (!CURRENT_CLASS.loadProjectToHtml(status)) {
    LOG.error("statistcs-main.js:: error loading the project status");
    rediret();
  }

  // ================ CHANGE THE STATUS ===============
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

  // ================ ADD USER =================
  // add to record, so we can remove it later
  CURRENT_CLASS.addEvent("click", CURRENT_CLASS.getBtnId("addUser"));
  $("body").on("click", CURRENT_CLASS.getBtnId("addUser"), async function () {
    
    // get user input
    let userEmail = $(CURRENT_CLASS.getTagId("inputUserNameOrEmail")).val();

    // verify if the user name is empty
    if (userEmail == undefined || !userEmail.length || !userEmail.includes("@")){
      
      $("#createUserErrorMessage").show();
      $("#createUserErrorMessage").text("Invalid input, Try again.");
    
    }else{

      // add the user
      let inviteWasSent = await CURRENT_CLASS.inviteUserToProject(userEmail).catch(err => {
        console.log("Error adding user: ", err);
      });

      // TODO: messase to user 
      if (inviteWasSent == undefined){LOG.error(":: statistics-main.js :: Error adding the user");}

      
      if (inviteWasSent) {
        console.log("Invite sent");
      }else{
        console.log("Error sending the invite");
      }

      $("#createUserErrorMessage").hide();
      $("#createUserErrorMessage").text('');
      $("#create-user").modal('hide');
    }
  });

  // ================= clean up the modals when they are opened out =========================

  // ===== CREATE USER
  CURRENT_CLASS.addEvent("show.bs.modal", "#create-user");
  $('#create-user').on("show.bs.modal", function(){
    $(CURRENT_CLASS.getTagId("inputUserNameOrEmail")).val('');
    $("#createUserErrorMessage").text('');
  });

  // ===== REMOVE USER
  CURRENT_CLASS.addEvent("show.bs.modal", '#remove-user');
  $('#remove-user').on("show.bs.modal", function(){
    $(CURRENT_CLASS.getTagId("inputRemoveUser")).val('');
    $("#removeUserErrorMessage").text('');
  });
});
