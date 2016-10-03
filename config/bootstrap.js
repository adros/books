//var Serie = require('../api/models/Serie');
var Promise = require('bluebird');
var _ = require('lodash');

var genre = require("../api/models/Genre");

module.exports.bootstrap = function(cb) {
  Genre.count()
    .then((count) => {
      if (count > 0) {
        return;
      }
      console.log("Importing genres:");
      return Promise.all(_.map(genre.initData, (value, key) => Genre.create({
          id: +key,
          name: value
        }).then(res => {
          console.log("imported", res.name);
          return res;
        })))
        .thenReturn(null);
    })
    .then(cb)
    .catch(cb);
};
