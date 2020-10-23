/**
 * Redirect to a HTML page
 * @param {String} html - path with html file 
 */
function redirect(html) {

    if (html == undefined || typeof(html) != typeof("")) {
        window.location.href = "../views/index.html";
    } else {
        window.location.href = html;
    }
}

/**
 * return true if the object is empty or is undefined. 
 * @param {Object} obj - object 
 */
function isObjectEmpty(obj) {
    return (obj == undefined || typeof(obj) != typeof({}) || Object.keys(keys).length == 0);
}