const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path')
const { database } = require('./config.json');

async function init() {
    try {
        return await open({
            filename: path.join(__dirname ,database),
            driver: sqlite3.Database
        })
    } catch (err) {
        console.error(err);
    }
}

module.exports = init();