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
  find3: function(req, res) {
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

  find: function(req, res) {
    var query = Promise.promisify(Book.query);
    query({
        text: `SELECT reading."yearOrder", reading.year, reading."totalOrder", reading.id, book.name, book.id as "bookId", author."lastName", author."firstName", author.id as "authorId"
                FROM reading
                    JOIN book
                        ON reading.book = book.id
                    JOIN author_books__book_authors
                        ON book.id = author_books__book_authors.book_authors
                    JOIN author
                        ON author_books__book_authors.author_books = author.id`
      })
      .then(results => results.rows)
      .then(data => {
        var obj = data.reduce((obj, item) => {
          var reading = obj[item.id];
          if (item.id in obj) {
            obj[item.id].authors.push({
              id: item.authorId,
              firstName: item.firstName,
              lastName: item.lastName
            });
          } else {
            obj[item.id] = item;
            item.authors = [{
              id: item.authorId,
              firstName: item.firstName,
              lastName: item.lastName
            }];
            delete item.authorId;
            delete item.firstName;
            delete item.lastName;
          }
          return obj;
        }, {});

        return _.sortBy(_.values(obj), "totalOrder");
      })
      .then(data => res.send(data))
      .catch(err => res.serverError(err));
  }
};
