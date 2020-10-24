const { remote } = require("electron");
const { session } = remote.require('./index.js'); // getting the DB connection

const viewsDir = session.get("projectDir");

/**
 * Redirect to a HTML page
 * @param {String} html - path with html file 
 */
function redirect(html) {

    if (html == undefined || typeof(html) != typeof("")) {
        window.location.href = `${viewsDir}/views/index.html`;
    } else {
        window.location.href = `${viewsDir}/${html}`;
    }
}

/**
 * return true if the object is empty or is undefined. 
 * @param {Object} obj - object 
 */
function isObjectEmpty(obj) {
    return (obj == undefined || typeof(obj) != typeof({}) || Object.keys(obj).length == 0);
}

module.exports = {
    redirect,
    isObjectEmpty
};