var Promise = require("bluebird");
var genre = require("../models/Genre");
var _ = require("lodash");

module.exports = {
  authorsBooksCount: function(req, res, next) {
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
  }
};
