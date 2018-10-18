var config = require('../config');

var sqlite3 = require('./sqlite3');

var redis = require('redis');
var client = redis.createClient({
  host: config.redis.host
});

client.on('error', function(err) {
  console.error(err);
});

module.exports.refresh = function(table, callback) {
  sqlite3.all('SELECT * FROM ' + table, function(err, rows) {
    if (rows) {
      client.set(table, JSON.stringify(rows));

      if (callback) {
        callback(rows);
      }
    }
  });
};

module.exports.client = client;
