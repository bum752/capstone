/*
  mqtt broker
*/
var mosca = require('mosca');
var mqtt = require('mqtt');

/*
  날씨, 헤드라인 뉴스 등
*/
var api = require('./src/api');
/*
  database: sqlite3
  memory cache: redis
*/
var sqlite3 = require('./src/sqlite3');
// var redis = require('./src/redis');

/*
  setting: config.json
*/
var config = require('./config');

var server = new mosca.Server({port: config.mosca.port});
var client  = mqtt.connect('mqtt://' + config.mosca.host);

server.on('ready', function(){
  console.log('mosca ready');

  /* mqtt client connect */
  client.on('connect', function () {
    console.log('mqtt client connect');

    client.subscribe('set');
    client.subscribe('unset');
    client.subscribe('get');
  });

  /* mqtt client subscribe */
  client.on('message', function (topic, message) {
    var msg = message.toString();
    var args = msg.split(' ');
    var cmd = args[0];

    if (topic === 'set') {

      if (cmd === 'alarm') {
        sqlite3.run('INSERT INTO alarm(title, hour, minute) VALUES (?, ?, ?)', [args.slice(3).join(' '), args[1], args[2]], function(error) {
          sqlite3.all('SELECT * FROM alarm', function(err, rows) {
            if (rows) {
              client.publish('alarm', JSON.stringify(rows));
            }
          });
        });
      } else if (cmd === 'schedule') {
        sqlite3.run('INSERT INTO schedule(title, time) VALUES (?, ?)', [args.slice(2).join(' '), args[1]], function() {
          sqlite3.all('SELECT * FROM schedule', function(err, rows) {
            if (rows) {
              client.publish('schedule', JSON.stringify(rows));
            }
          });
        });
      }

    } else if (topic === 'unset') {

      if (cmd === 'alarm') {
        sqlite3.run('DELETE FROM alarm WHERE id=?', [args[1]], function(error) {
          sqlite3.all('SELECT * FROM alarm', function(err, rows) {
            if (rows) {
              client.publish('alarm', JSON.stringify(rows));
            }
          });
        });
      } else if (cmd === 'schedule') {
        sqlite3.run('DELETE FROM schedule WHERE id=?', [args[1]], function(error) {
          sqlite3.all('SELECT * FROM schedule', function(err, rows) {
            if (rows) {
              client.publish('schedule', JSON.stringify(rows));
            }
          });
        });
      }

    } else if (topic === 'get') {

      if (cmd === 'weather') {
        api.weather(args[1], function(res) {
          client.publish('weather', res);
        });
      } else if (cmd === 'news') {
        api.news(function(res) {
          client.publish('news', JSON.stringify(res));
        });
      } else if (cmd === 'alarm') {
        sqlite3.all('SELECT * FROM alarm', function(err, rows) {
          if (rows) {
            client.publish('alarm', JSON.stringify(rows));
          }
        });
      } else if (cmd === 'schedule') {
        sqlite3.all('SELECT * FROM schedule', function(err, rows) {
          if (rows) {
            client.publish('schedule', JSON.stringify(rows));
          }
        });
      }

    }

  });
});
