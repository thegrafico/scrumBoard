var sqlite3 = require('sqlite3').verbose();


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
    create_user(userName, userEmail, password) {

        let params = [
            { var: userName, type: 's', canBeNull: false },
            { var: userEmail, type: 's', canBeNull: false },
            { var: password, type: 's', canBeNull: false }
        ];

        // verify if the parameters are good to use
        if (!this._verifyParameters(params)) {
            console.log("Bad Parameters");
        } else {
            console.log("Good Parameters");
        }

        let create_user = `INSERT INTO USER (user_id, name, email, password, date_user_was_added) VALUES(?, ?, ?, ?, ?)`;

        this.db.run(create_user, [null, userName, userEmail, password, this._getDate()], function(err) {
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        })
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

                if ((objectValue[kname] == undefined) || (typeof(objectValue[kname]) != typeof(1))) {
                    console.log(`The Parameter ${objectValue[kname]} have an error`);
                    return false;
                }
            }
        }

        return true;
    }

}
// CREATE TABLE IF NOT EXISTS USER(
//     --     user_id INTEGER PRIMARY KEY,
//     --     name TEXT NOT NULL,
//     --     email TEXT NOT NULL UNIQUE,
//     --     password TEXT NOT NULL,
//     --     date_user_was_added TEXT
//     -- );


module.exports = { db: ScrumDB }