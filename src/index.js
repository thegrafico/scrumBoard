//  Dependencies
const { app, BrowserWindow } = require("electron");
const path = require("path");
const { db } = require('../database/db_handler');
const conn = new db("scrumDB.sqlite3");


conn.getProjectsByUser().then(results => {
    console.log(results);
}).catch(err => {
    console.log("err: ", err);

});


// reload electron
require('electron-reload')(__dirname);


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    // eslint-disable-line global-require
    app.quit();
}


// ========= CREATING A USER =========
// conn.createUser("Raul Pichardo", "raul022107@gmail.com", "xxxxxxx").then((userID) => {
//     console.log("User was created with the id: ", userID);
// }).catch((err) => {
//     console.log("ERROR: ", err);
// });
// ==================================


const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: "ScrumBoard",
        webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true,
            enableRemoteModule: true
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "./views/index.html"));

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    mainWindow.maximize();
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
    conn
};

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.