var Promise = require("bluebird");
var genre = require("../models/Genre");

module.exports = {
  import: function(req, res, next) {
    var backupData = req.body.books_backup;

    // <author_book>
    //     <id>26</id>
    //     <author_id>14</author_id>
    //     <book_id>28</book_id>
    // </author_book>

    var bookToAuthors = backupData.author_books[0].author_book.reduce((obj, ab) => {
      var authorId = +ab.author_id[0];
      var bookId = +ab.book_id[0];
      obj[bookId] = obj[bookId] || [];
      obj[bookId].push(authorId);
      return obj;
    });
    var bookToSeries = backupData.book_series[0].book_serie.reduce((obj, bs) => {
      var serieId = +bs.serie_id[0];
      var bookId = +bs.book_id[0];
      obj[bookId] = obj[bookId] || [];
      obj[bookId].push(serieId);
      return obj;
    });

    Promise.all([
        Author.destroy({}),
        Book.destroy({}),
        Reading.destroy({}),
        Serie.destroy({})
      ])
      .thenReturn({})
      .then(importData(Author, backupData.authors[0].author, authorDataFn, "authors"))
      .then(importData(Serie, backupData.series[0].serie, serieDataFn, "series"))
      .then(importData(Book, backupData.books[0].book, bookDataFn.bind(null, bookToAuthors, bookToSeries), "books"))
      .then(importData(Reading, backupData.readings[0].reading, readingDataFn, "readings"))
      .then(data => res.send(data))
      .catch(err => res.serverError(err));
  }
};

function authorDataFn(author) {
  return {
    id: +author.author_id[0],
    firstName: author.first_name[0],
    lastName: author.last_name[0],
    dateOfBirth: author.date_of_birth[0] || null,
    dateOfDeath: author.date_of_death[0] || null,
    link: author.link[0],
    pictureUrl: author.picture_url[0],
    nationality: author.nationality[0]
  };
}

function serieDataFn(serie) {
  return {
    id: +serie.serie_id[0],
    name: serie.title[0],
    totalCount: +serie.total_count[0]
  };
}

function bookDataFn(bookToAuthors, bookToSeries, book) {
  var id = +book.book_id[0]
  return {
    id: id,
    name: book.title[0],
    genre: getGenre(book.genre[0]),
    authors: bookToAuthors[id],
    series: bookToSeries[id]
  };
}

function readingDataFn(reading) {
  return {
    id: +reading.reading_id[0],
    year: +reading.year[0],
    yearOrder: +reading.year_order[0],
    totalOrder: +reading.total_order[0],
    book: +reading.book_id[0]
  };
}

function importData(collection, data, dataFn, prop) {
  return (result) => {
    return Promise.map(data.map(dataFn), data => collection.create(data), {
        concurrency: 10
      })
      .then(results => {
        result[prop] = results;
        return result
      })
  }
}

function getGenre(str) {
  var key = _.findKey(genre.initData, val => (val == str));
  if (!key) {
    throw new Error("unknown genre: " + str);
  }
  return +key;
}
