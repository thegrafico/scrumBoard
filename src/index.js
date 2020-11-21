//  Dependencies
const { app, BrowserWindow } = require("electron");
const path = require("path");
const { mySession } = require('./storage/mySession');
const { db, status } = require('../database/db_handler');
const conn = new db("scrumDB.sqlite3");

let sess = new mySession({ time: "2h" });

// reload electron
require('electron-reload')(__dirname);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    // eslint-disable-line global-require
    app.quit();
}

// create a rolling file logger based on date/time that fires process events
const opts = {
    // errorEventName: 'error',
    logDirectory: 'log/', // NOTE: folder must exist and be writable...
    fileNamePattern: 'roll-<DATE>.log',
    dateFormat: 'YYYY.MM.DD'
};

// LOG object 
const LOG = require('simple-node-logger').createRollingFileLogger(opts);

// =============== TESTIN DB ===============
// conn.inviteUserToProject("devpichardo@gmail.com", 2).then(result => {
//     console.log("SUCCESS: ", result);
// }).catch(err => {
//     console.log("ERROR: ", err);
// })
// =========================================

const createWindow = () => {

    sess.set("user", "Raul Pichardo");
    sess.set("projectDir", __dirname);

    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Scrum Board",
        webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true,
            enableRemoteModule: true
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "./views/index.html"));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.maximize();

    LOG.info(":: STARTED APP :: SUCCESS");
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

module.exports = {
    createWindow,
    conn,
    status,
    session: sess,
    LOG,
};

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.