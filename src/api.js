var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var key = require('../key');

module.exports.weather = function(city, callback) {
  var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + key.openweather;
  request.get(url, function(error, response, body) {
    if (error) return callback(error);
    else if (response.statusCode !== 200) return callback(response);
    else return callback(body);
  });
};

module.exports.news = function(callback) {
  var url = 'https://news.naver.com/';
  request.get({url: url, encoding: null}, function(error, response, body) {
    if (error) return callback(error);
    else if (response.statusCode !== 200) return callback(response);
    else {
      var $ = cheerio.load(iconv.decode(body, 'euc-kr'));
      var headlines = [];

      $('.newsnow_txarea').find('li').each(function(i, c) {
        headlines.push($(this).text().trim());
      });

      callback(headlines);
    }
  });
};
