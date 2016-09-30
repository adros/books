//var Serie = require('../api/models/Serie');
var series = require('./bootstrap/serie');
var Promise = require('bluebird');

module.exports.bootstrap = function(cb) {
  Serie.destroy({})
    .then(() => {
      return Promise.all(series.data.map(serie => Serie.create(serie)))
        .thenReturn(null);
    })
    .then(cb)
    .catch(cb);
};
