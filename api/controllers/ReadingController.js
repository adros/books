/**
 * ReadingController
 *
 * @description :: Server-side logic for managing readings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require("bluebird");
var _ = require("lodash");

module.exports = {
  // findOld: function(req, res) {
  //   Reading.find({
  //       sort: "totalOrder" //,limit:40
  //     })
  //     .then(readings => {
  //       return Promise.map(readings, r => {
  //         return Book.findOne({
  //             id: r.book
  //           })
  //           .populate("authors")
  //           .then(book => {
  //             r.book = book;
  //             r.authors = book.authors;
  //             return r;
  //           });
  //       }, {
  //         concurrency: 100
  //       });
  //     })
  //     .then(data => res.send(data))
  //     .catch(err => res.serverError(err));
  // },
  find: function(req, res) {
    Book.find()
      .populate("authors")
      .populate("readings")
      .then(books => {
        var result = books.reduce((readings, book) => {
          book.readings.forEach(r => readings.push({
            year: r.year,
            yearOrder: r.yearOrder,
            totalOrder: r.totalOrder,
            book: {
              id: book.id,
              name: book.name
            },
            authors: book.authors.map(a => ({
              id: a.id,
              firstName: a.firstName,
              lastName: a.lastName
            }))
          }))
          return readings;
        }, []).sort();
        return _.sortBy(result, "totalOrder");
      })
      .then(data => res.send(data))
      .catch(err => res.serverError(err));
  },
};
