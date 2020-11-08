class Statistics {
  static VIEW_PATH = "../views/partials/project-statistics.html";

  #buttosId = {
    addUser: "#addUserBtn",
    removeUser: "#removeUserBtn",
    viewPerformance: "#viewPerformancesBtn",
  };

  #tagsId = {
    tagProjectName: "#projectName",
    tagOwnerName: "#ownerName",
    tagStatusList: "#statusMenu",
    tagCurrentStatus: "#currentStatus",
    tagBtnToggleStatus: "#btnToggleStatus",
    tagStartDate: "#startDate",
    tagCurrentSprint: "#currentSprint",
  };

  /**
   * Constructor for the Statistics class
   * @param {Object} conn - database connection 
   * @param {Number} projectId - id of the project 
   */
  constructor(conn, projectId) {

    if (projectId == undefined || isNaN(projectId) || projectId == -1){
        throw "Invalid Project Id";
    }

    this.conn = conn;
    this.projectId = projectId;

    
  }
  /**
   * Get the project information
   * @returns {Promise} - with project info object
   */
  getProjectInfo(){
    return new Promise(async function (resolve, reject) {    
        let project = await conn.getProjectInfoById(this.projectId).catch((error) => {
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
   */
  loadProjectToHtml(){

  }

  /**
   * Get the button id
   * @param {String} key - key of the button
   * @returns Tag ID if exist, otherwise -1
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
}

module.exports = {
  Statistics,
};
