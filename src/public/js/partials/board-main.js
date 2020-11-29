/**
 * board-main.js:
 * This file is in charge of all functionalities for backload page
 */

$(document).ready(function () {
  LOG.info(":: board-main.js:: dynamic script was loaded");

  // init a new class Statistics base
  CURRENT_CLASS = new Backlog(conn, getProjectId(), USER_NAME);



  // create new task item
  $("#btnCreateItemTask").on("click", function(){
    
    let itemTitle = $("#itemTitle").val();
    let itemDescription = $("#itemDescription").val();
    let itemPriority = $("#itemPriority").val();
    let itemPoints = $("#itemPoints").val();
    let itemTags = $("#itemTags").val();

    console.log(itemTitle);
    console.log(itemDescription);
    console.log(itemPriority);
    console.log(itemPoints);
    console.log(itemTags);

    // $("#create-task").hide()
  });

  // ======================= CLEANING MODALS =====================

  // clean the create task modal before showing it to the user
  CURRENT_CLASS.addEvent("show.bs.modal", "#create-task");
  $('#create-task').on("show.bs.modal", function(){
    // cleaning the input types before accessing it 
    CURRENT_CLASS.cleanModalCreateTask();
  });


});
