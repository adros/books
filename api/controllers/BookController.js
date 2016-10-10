/**
 * BookController
 *
 * @description :: Server-side logic for managing books
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird');

module.exports = {
  find: function(req, res) {
    var countQuery = Object.assign({}, req.query);
    delete countQuery.limit;
    delete countQuery.skip;

    Promise.all([
        Book.find(req.query).populate("genre").populate("authors").populate("series").populate("readings"),
        req.query.limit && Book.count(countQuery)
      ])
      .spread((data, total) => {
        if (total != null) {
          res.setHeader("X-Total", total);
        }
        res.send(data);
      })
      .catch(err => res.serverError(err));
  }

};
