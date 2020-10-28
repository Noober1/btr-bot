const sqlite3 = require('sqlite3');
const Promise = require('bluebird');
const { database } = require('./config.json');
const path = require('path')

class AppDAO {
    constructor() {
        this.db = new sqlite3.Database(path.join(__dirname, database), err => {
            if(err) console.log(err)
        })
        this.db.run('CREATE TABLE IF NOT EXISTS attendance(guild,date,roleId,data VARCHAR(255))')
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    console.log('Error running sql ' + sql);
                    console.log(err);
                    reject(err)
                } else {
                    resolve({id: this.lastID})
                }
            })
        })
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql);
                    console.log(err);
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = new AppDAO;