var mosca = require('mosca');
var mqtt = require('mqtt');
var api = require('./src/api');
var config = require('./config');

var server = new mosca.Server({port: config.mosca.port});
var client  = mqtt.connect('mqtt://' + config.mosca.host);

server.on('ready', function(){
  console.log('mosca ready');

  /* mqtt client connect */
  client.on('connect', function () {
    client.subscribe('info');
  });

  /* mqtt client subscribe */
  client.on('message', function (topic, message) {
    var msg = message.toString();
    if (topic === 'info') {
      args = msg.split(' ');
      cmd = args[0];
      if (cmd === 'weather') {
        api.weather(args[1], function(res) {
          client.publish('weather', res);
        });
      } else if (cmd === 'news') {
        api.news(function(res) {
          client.publish('news', JSON.stringify(res));
        });
      }
    }
  });
});
