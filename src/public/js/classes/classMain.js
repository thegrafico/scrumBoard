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
  };

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
  getProjectInfo() {
    return new Promise(async function (resolve, reject) {
      let project = await conn
        .getProjectInfoById(this.projectId)
        .catch((error) => {
          LOG.error(
            ":: scrum-main::getProjectInfo ==> Error getting the project from the db: " +
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
  loadProjectToHtml(status) {

    if (status == undefined || status.project_status == undefined) { return false;}

    let projectStatus = status.project_status;
    
    // set the default status 
    $(this.#tagsId["currentStatus"]).text(projectStatus[0]);
    
    let btnClass = this.#buttosId["statusItem"];
    btnClass = btnClass.substring(1);
    
    // load the list of the status
    projectStatus.forEach(function (item) {
      $(Father.#tagsId["statusList"]).append(
        `<li>  <a class='${btnClass}' role="button" href='#'>${item}</a>  </li>`
      );
    });

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
   * @param {String} event - event to add - click, change, load 
   * @param {String} element - element to add to event 
   */
  addEvent(event, element){

    // early exit condition
    if (!event || !element) {return;}
    
    // add listener to EVENT object
    this.#EVENTS[event] = element;
  }
}

module.exports = {
  Statistics,
};
