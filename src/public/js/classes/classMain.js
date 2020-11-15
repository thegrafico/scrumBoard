class Statistics {
  static VIEW_PATH = "../views/partials/project-statistics.html";

  #buttosId = {
    addUser: "#addUserBtn",
    removeUser: "#removeUserBtn",
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
    projectDescription: "#projectDescription"
  };

  #project = undefined;

  #EVENTS = {};

  /**
   * Constructor for the Statistics class
   * @param {Object} conn - database connection
   * @param {Number} projectId - id of the project
   */
  constructor(conn, projectId) {
    if (projectId == undefined || isNaN(projectId) || projectId == -1) {
      throw "Invalid Project Id";
    }

    if (conn == undefined) {
      throw "Invalid Connection for Stastistics";
    }

    this.conn = conn;
    this.projectId = projectId;
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
      console.log("Error getting the project information");
      LOG.error(":: ClassMain.js::Constructor ==> error getting  project info: " + err);
    });

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
  
    if (this.#project){
      // TODO: get the user name using sessions && get current Sprint
      $(this.getTagId("ownerName")).text("Raul Pichardo");
      $(this.getTagId("currentSprint")).text("Sprint 1");
      $(this.getTagId("projectName")).text(this.#project["name"]);
      $(this.getTagId("startDate")).text(this.#project["date_created"]);
      $(this.getTagId("projectDescription")).text(this.#project["description"]);
    }

    return true;
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
  unload(){
    let events = this.#EVENTS;
    
    for (let key in events){
      $("body").off(events[key], key);
    }
  
  }
}

module.exports = {
  Statistics,
};
