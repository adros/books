/**
 * ReadingController
 *
 * @description :: Server-side logic for managing readings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require("bluebird");

module.exports = {
  find: function(req, res) {
    Reading.find({
        sort: "totalOrder"
      })
      .then(readings => {
        return Promise.map(readings, r => {
          return Book.findOne({
              id: r.book
            })
            .populate("authors")
            .then(book => {
              r.book = book;
              r.authors = book.authors;
              return r;
            });
        }, {
          concurrency: 100
        });
      })
      .then(data => res.send(data))
      .catch(err => res.serverError(err));
  },
};
