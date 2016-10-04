var Promise = require("bluebird");
var genre = require("../models/Genre");
var _ = require("lodash");

module.exports = {
  authorsBooksCount: function(req, res) {
    Author.find()
      .populate('books')
      .then(data => {
        data = data.map(a => {
          return {
            name: `${a.firstName} ${a.lastName}`,
            value: a.books.length
          };
        });
        return _.reverse(_.sortBy(data, "value")).slice(0, 10);
      })
      .then(data => res.send(data))
      .catch(err => res.serverError(err));
  },
  yearBooksCount: function(req, res) {
    Reading.find()
      .populate('book')
      .then(data => {
        data = data.reduce((obj, reading) => {
          obj[reading.year] = (obj[reading.year] || 0) + 1;
          return obj;
        }, {});

        data = _.reduce(data, (arr, val, prop) => {
          arr.push({
            name: prop + "",
            value: val
          });
          return arr;
        }, []);
        return _.sortBy(data, "name");
      })
      .then(data => res.send(data))
      .catch(err => res.serverError(err));
  }
};
