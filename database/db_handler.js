var sqlite3 = require('sqlite3').verbose();
const errorMsg = require('../src/public/js/error-code').errorCodes;
const STATUS = { new: "new", active: "active", closed: "closed", project_status: ["new", "on track", "closed"] };

let USERID = 1;

class ScrumDB {

    /**
     * Create a new DB object with the name past on parameter
     * @param {String} dbPath 
     */
    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath);
    }

    /**
     * Insert values in table
     * @param {String} userName - name of the user
     * @param {String} userEmail - email of the user
     * @param {String} password - password for the user
     */
    createUser(userName, userEmail, password) {

        let father = this;
        return new Promise(function(resolve, reject) {

            let params = [
                { var: userName, type: 's', canBeNull: false },
                { var: userEmail, type: 's', canBeNull: false },
                { var: password, type: 's', canBeNull: false }
            ];

            // verify if the parameters are good to use
            if (!father._verifyParameters(params)) {
                console.log("Bad Parameters");
                return reject(errorMsg["BAD_PARAMETER"]);
            }

            let create_user = `INSERT INTO USER (user_id, name, email, password, date_user_was_added) VALUES(?, ?, ?, ?, ?)`;


            father.db.run(create_user, [null, userName.toLocaleLowerCase(), userEmail.toLocaleLowerCase(), password, father._getDate()], function(err) {

                if (err) return reject(err);

                // return user id
                resolve(this.lastID);
            });
        });
    }

    /**
     * 
     * @param {Number} userId - id of the user - who created the project 
     * @param {String} name  - name of the project
     * @param {String} description - description of the project
     */
    createProject(name, description, userId = USERID) {

        let father = this;

        return new Promise(function(resolve, reject) {

            let params = [
                { var: userId, type: 'n', canBeNull: false },
                { var: name, type: 's', canBeNull: false },
                { var: description, type: 's', canBeNull: true },
            ];

            // verify parameters
            if (!father._verifyParameters(params)) { return reject(errorMsg.BAD_PARAMETER) }

            // query for db
            let create_project = 'INSERT INTO PROJECT (project_id, status, name, description, date_created, owner_id) VALUES (?, ?, ?, ?, ?, ?)';

            // create table
            father.db.run(create_project, [null, STATUS.new, name, description, father._getDate(), userId], function(err) {
                if (err) return reject(err);

                // return id of the project created
                resolve(this.lastID);
            });
        });
    }

    /**
     * get user id by user email
     * @param {String} email - email of the user
     */
    getUserIdByEmail(email){
        let father = this;

        return new Promise(function(resolve, reject){
            
            if (!father._verifyParameters([{ var: email, type: 's', canBeNull: false }])){
                return reject(errorMsg.BAD_PARAMETER);
            }
            
            let getUserId = 'SELECT user_id FROM USER WHERE USER.email = ?';
            
            father.db.all(getUserId, [email], function(err, result){

                if (err){
                    reject(err);
                    return;
                }

                resolve(result[0]);
            });
        });
    }

    /**
     * get project information by user id
     * @param {Number} userId - id of the user 
     */
    getProjectsByUser(userId = USERID) {
        let father = this;
        return new Promise(function(resolve, reject) {

            // verify userid
            if (!father._verifyParameters([{ var: userId, type: 'n', canBeNull: false }])) {
                return reject(errorMsg.BAD_PARAMETER);
            }

            let getProjects = `SELECT * FROM PROJECT WHERE owner_id = ?`;

            father.db.all(getProjects, [userId], function(err, results) {
                return (err != undefined) ? reject(err) : resolve(results);
            });

        });
    }

    /**
     * Get the project id
     * @param {Number} projectId - id of the project 
     */
    getProjectInfoById(projectId) {

        let father = this;

        return new Promise(function(resolve, reject) {

            // verify userid
            if (!father._verifyParameters([{ var: projectId, type: 'n', canBeNull: false }])) {
                return reject(errorMsg.BAD_PARAMETER);
            }

            let getProjectById = 'SELECT * FROM PROJECT WHERE PROJECT.project_id = ?';

            father.db.all(getProjectById, [projectId], function(err, results) {
                return (err != undefined) ? reject(err) : resolve(results);
            });
        });
    }

    /**
     * get the member information of a project
     * @param {Number} projectId 
     * @returns {Promise} member information for the project
     */
    getMemberInformation(projectId){
        let father = this;

        return new Promise(function(resolve, reject){
            // verify userid
            if (!father._verifyParameters([{ var: projectId, type: 'n', canBeNull: false }])) {
                return reject(errorMsg.BAD_PARAMETER);
            }

            let getMemberInfo = 'SELECT * FROM PROJECT_USER WHERE PROJECT_USER.project_id = ?';
            father.db.all(getMemberInfo, [projectId], function(err, results){
                return (err != undefined) ? reject(err) : resolve(results);
            });
        });
    }

    /**
     * @return {String}- todays date in the following format: month/day/year
     */
    _getDate() {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        return `${mm}/${dd}/${yyyy}`;
    }


    /**
     * @param {Array[Object]} inputs - Array with key value object with the parameter name and the type expected 
     * @return {Boolean} true if all parameters are good
     */
    _verifyParameters(inputs) {

        // keys in object
        let ktype = 'type',
            kcanBeNull = 'canBeNull',
            kname = 'var';

        if (typeof(inputs) != typeof([]) || inputs.length == 0) {
            return false;
        }

        for (let idx in inputs) {

            let objectValue = inputs[idx];

            // verify is an object
            if (typeof(objectValue) != typeof({}) || !(ktype in objectValue) || !(kname in objectValue) || !(kcanBeNull in objectValue)) {
                console.log(`The Parameter ${objectValue[kname]} have an error`);
                return false;
            }

            // if the value can be null
            if (objectValue[kcanBeNull]) continue;

            // Verify string
            if (objectValue[ktype] == 's') {


                if ((objectValue[kname] == undefined) || // verify is undefined
                    (typeof(objectValue[kname]) != typeof("")) || //verify is type match
                    (objectValue[kname].length == 0)) { //verify is greater than 0
                    console.log(`The Parameter ${objectValue[kname]} have an error`);
                    return false;
                }

            } else { // type number

                if ((objectValue[kname] == undefined) || (isNaN(objectValue[kname]))) {
                    console.log(`The Parameter '${objectValue[kname]}' have an error`);
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * send invitation to user to belong to a project 
     * @param {String} email - user email is isEmail is true, otherwise username
     */
    inviteUserToProject(email, projectId){
        let father = this;

        let params = [
            { var: email, type: 's', canBeNull: false }, 
            { var: projectId, type: 'n', canBeNull: false }
        ];

        return new Promise(async function(resolve, reject){
            
            // verify userid
            if (!father._verifyParameters(params)) {
                return reject(errorMsg.BAD_PARAMETER);
            }

            let errorMessage = undefined;
            
            let userId = await father.getUserIdByEmail(email).catch(err => {
                errorMessage = err;
            });

            if (!userId || errorMessage != undefined) return reject(errorMsg.USER_NOT_FOUND);

            let sendInviteToUser = 'INSERT INTO PROJECT_USER_INVITATION(project_id, user_id, date_invitation_was_sent) VALUES (?, ?, ?)';

            father.db.all(sendInviteToUser, [projectId, userId.user_id, father._getDate()], function(err){
                (err != undefined) ? reject(err) : resolve(true);
            });
        });
    }

}

module.exports = { db: ScrumDB, status: STATUS };

// ========= CREATING A USER =========
// conn.createUser("Raul Pichardo", "raul022107@gmail.com", "xxxxxxx").then((userID) => {
//     console.log("User was created with the id: ", userID);
// }).catch((err) => {
//     console.log("ERROR: ", err);
// });
// ==================================
