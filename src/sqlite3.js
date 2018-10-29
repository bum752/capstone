var config = require('../config');
var sqlite3 = require('sqlite3');

var db = new sqlite3.Database(config.sqlite3.filename);

db.serialize(function() {
  db.get('SELECT name FROM sqlite_master WHERE type="table" AND name="alarm"', function(err, row) {
    if (row === undefined) {
      db.run('CREATE TABLE alarm (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(20), hour VARCHAR(2) NOT NULL, minute VARCHAR(2) NOT NULL)');
      db.run('CREATE TABLE schedule (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(20), time DATETIME NOT NULL)');
    }
  });
});

module.exports = db;
