var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('scrumDB.sqlite3', createTable);


class ScrumDB {
    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath);
    }

    createTable(tableInfo) {

    }

}