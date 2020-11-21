class Statistics {
  static VIEW_PATH = "../views/partials/project-statistics.html";

  #buttosId = {
    addUser: "#btnAddUser",
    cancelAddUser: "#btnCancelUser",
    removeUser: "#btnRemoveUser",
    cancelRemoveUser: "#btnCancelRemoveUser",
    viewPerformance: "#viewPerformancesBtn",
    statusItem: ".status-item",
    toggleStatus: "#btnToggleStatus",
  };

  #tagsId = {
    projectName: "#projectName",
    ownerName: "#ownerName",
    statusList: "#statusMenu",
    currentStatus: "#currentStatus",
    startDate: "#startDate",
    currentSprint: "#currentSprint",
    projectDescription: "#projectDescription",
    NumberOfMembers: "#NumberOfMembers",
    inputUserNameOrEmail: "#usernameOrEmail",
    inputRemoveUser: "#removeUsersNameOrEmails"
  };

  // store all project information in a object
  #project = undefined;

  // all events should be stored here, so its more easy remove then when this class is deleted
  #EVENTS = {};

  /**
   * Constructor for the Statistics class
   * @param {Object} conn - database connection
   * @param {Number} projectId - id of the project
   */
  constructor(conn, projectId, username = undefined) {
    if (projectId == undefined || isNaN(projectId) || projectId == -1) {
      throw "Invalid Project Id";
    }

    if (conn == undefined) {
      throw "Invalid Connection for Stastistics";
    }

    this.username = username;
    this.conn = conn;
    this.projectId = projectId;
  }

  /**
   * send an invite user to project
   * @param {String} email - user email 
   * @returns {Promise} - true if the user was added
   */
  inviteUserToProject(email){
    
    let father = this;

    return new Promise(async function(resolve, reject){
      
      if (!email == undefined || !email.length) return reject("Invalid username or email");

      let inviteWasSent = await conn.inviteUserToProject(email, father.projectId).catch(err => {
        LOG.error(":: classMain.js :: statistics :: Error inviting user: " + err);
      });
      
      // if invite was sent resolve with true
      (inviteWasSent) ? resolve(true) : reject(false);
    });
  }

  /**
   * Get the project information
   * @returns {Promise} - with project info object
   */
  #getProjectInfo() {
    let projectId = this.projectId;
    return new Promise(async function (resolve, reject) {
      let project = await conn.getProjectInfoById(projectId).catch((error) => {
        LOG.error(
          ":: ClassMain.js::getProjectInfo ==> Error getting the project from the db: " +
            error
        );
        reject(error);
      });

      resolve(project[0]);
    });
  }

  /**
   * Load statistical model to html
   * @param {Status} - all available status
   * @returns {Boolean} - true if the project was successfully loaded
   */
  async loadProjectToHtml(status) {
    if (status == undefined || status.project_status == undefined) {
      return false;
    }

    // loading project info
    this.#project = await this.#getProjectInfo(this.projectId).catch((err) => {
      LOG.error(
        ":: ClassMain.js::loadProjectToHtml ==> error getting  project info: " +
          err
      );
    });

    // get the information for the div car: members
    let memberInformation = await this.#getMemberInformation().catch((err) => {
      LOG.error(
        ":: ClassMain.js::loadProjectToHtml ==> error getting  member info: " +
          err
      );
    });
    
    // add member information
    if (memberInformation != undefined){
      let numberOfUserInProject = memberInformation.length;
      let message = '';
      // if there is not element inside the object
      if (!numberOfUserInProject){
        message = "You don't have any member yet.";
      }else{
        message = `${numberOfUserInProject} members`;
      }

      $(this.#tagsId["NumberOfMembers"]).text(message);
    }

    let projectStatus = status.project_status;

    // ===============================  Status div =====================================
    // set the default status
    $(this.#tagsId["currentStatus"]).text(projectStatus[0]);

    // list element
    let list = this.#tagsId["statusList"];

    // getting the button id
    let btnClass = this.#buttosId["statusItem"];

    // remove the first string since we are getting the class Ex. (.status => status)
    btnClass = btnClass.substring(1);

    // load the list of the status
    projectStatus.forEach(function (item) {
      $(list).append(
        `<li>  <a class='${btnClass}' role="button" href='#'>${item}</a>  </li>`
      );
    });
    // =========================================================================

    if (this.#project) {
      // TODO: get the user name using sessions && get current Sprint
      $(this.getTagId("ownerName")).text(this.username);
      $(this.getTagId("currentSprint")).text("Sprint 1");
      $(this.getTagId("projectName")).text(this.#project["name"]);
      $(this.getTagId("startDate")).text(this.#project["date_created"]);
      $(this.getTagId("projectDescription")).text(this.#project["description"]);
    }

    return true;
  }
  /**
   * Get the member information
   * @returns {Object}
   */
  #getMemberInformation() {
    let projectId = this.projectId;

    return new Promise(async function (resolve, reject) {
      let memberInfo = await conn
        .getMemberInformation(projectId)
        .catch((error) => {
          LOG.error(
            ":: ClassMain.js::getProjectInfo ==> Error getting the member information from the db: " +
              error
          );
          reject(error);
        });

      // verify is empty
      if (!memberInfo.length) {
        resolve({});
      }

      resolve(memberInfo);
    });
  }

  /**
   * Get the button id
   * @param {String} key - key of the button
   * @returns {String} Tag ID if exist, otherwise -1
   */
  getBtnId(key) {
    if (key in this.#buttosId) {
      return this.#buttosId[key];
    }

    return -1;
  }

  /**
   * Return the tag id
   * @param {String} key - tag name
   * @returns Tag ID if exist, otherwise -1
   */
  getTagId(key) {
    if (key in this.#tagsId) {
      return this.#tagsId[key];
    }

    return -1;
  }

  /**
   * Store add event so it can be removed later when class is removed
   *  Ex: {"class": "click"}
   * @param {String} eventType - event to add - click, change, load
   * @param {String} element - element to add to event
   */
  addEvent(eventType, element) {
    // early exit condition
    if (!eventType || !element) {
      return;
    }

    // add listener to EVENT object
    this.#EVENTS[element] = eventType;
  }

  /**
   * This function should be available in all clases. TODO: inherance
   */
  unload() {
    let events = this.#EVENTS;

    for (let key in events) {
      $("body").off(events[key], key);
    }
  }
}

module.exports = {
  Statistics,
};
