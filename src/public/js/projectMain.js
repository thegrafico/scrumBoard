window.$ = window.jQuery = require("../public/js/jquery3.5.2.js")

const { remote } = require("electron");
const { conn, status, session } = remote.require('./index.js'); // getting the DB connection


console.log("HERE");

$(document).ready(function() {

    console.log(session.get("url"));
});