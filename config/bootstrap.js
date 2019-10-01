const { parseString } = require('xml2js');
const fs = require('fs');
const path = require('path');

const dataUri = require('datauri').promise;
const { removeDiacriticalMarks } = require('../api/common/remove-diacritical-marks');

let importDataPromise;

const CLEAR_COLLECTIONS = true;

module.exports.bootstrap = async function () {

  await importSeries();
  await importAuthors();
  await importBooks();
  await importReadings();

};

async function importSeries() {
  CLEAR_COLLECTIONS && await Serie.destroy({});
  if (await Serie.count() > 0) { return };

  var series = (await getImportData()).series.serie;

  await Serie.createEach(series.map(({ serie_id, title, total_count }) => ({
    id: +serie_id,
    title,
    totalCount: total_count
  })));
}

async function importAuthors() {
  CLEAR_COLLECTIONS && await Author.destroy({});
  if (await Author.count() > 0) { return };

  var authors = (await getImportData()).authors.author;

  var authorsData = await Promise.all(authors.map(async function (item) {
    const pictureName = item.picture_url && item.picture_url.split('/').pop();
    const pictureUrl = pictureName && (await getAuthorImage(pictureName));
    const firstName = item.first_name.trim();
    const lastName = item.last_name.trim();
    const data = {
      id: +item.author_id,
      dateOfBirth: item.date_of_birth && item.date_of_birth == '1900-01-01T00:00:00' ? null : item.date_of_birth,
      dateOfDeath: item.date_of_death ? item.date_of_death : null,
      firstName,
      lastName,
      link: item.link,
      nationality: item.nationality,
      pictureName,
      pictureUrl,

      firstNameSearch: removeDiacriticalMarks(firstName).toUpperCase(),
      lastNameSearch: removeDiacriticalMarks(lastName).toUpperCase()
    };

    return data;
  }));

  await Author.createEach(authorsData);
}

async function importBooks() {
  CLEAR_COLLECTIONS && await Book.destroy({});
  if (await Book.count() > 0) { return };

  var books = (await getImportData()).books.book;
  var bookSeries = (await getImportData()).book_series.book_serie;
  var authorBooks = (await getImportData()).author_books.author_book;

  var booksData = await Promise.all(books.map(async function (item) {
    const pictureName = item.picture_url && item.picture_url.split('/').pop();
    const pictureUrl = pictureName && (await getBookImage(pictureName));
    const series = bookSeries.filter(({ book_id }) => book_id == item.book_id).map(({ serie_id }) => serie_id);
    const authors = authorBooks.filter(({ book_id }) => book_id == item.book_id).map(({ author_id }) => author_id);

    const title = item.title.trim();
    const original = item.original == '-' ? undefined : item.original.trim();
    debugger;
    return {
      id: +item.book_id,
      title,
      original,
      pages: +item.pages,
      published: item.published ? +item.published : undefined,
      description: item.description,
      home: item.home == 'true',
      genre: item.genre,
      pictureUrl,
      pictureName,
      series: series, // no empty string
      authors: authors,

      titleSearch: removeDiacriticalMarks(title).toUpperCase(),
      originalSearch: original ? removeDiacriticalMarks(original).toUpperCase() : undefined
    };
  }));

  await Book.createEach(booksData);

}

async function importReadings() {
  CLEAR_COLLECTIONS && await Reading.destroy({});
  if (await Reading.count() > 0) { return };

  var readings = (await getImportData()).readings.reading;

  var readingsData = await Promise.all(readings.map(async function (item) {
    return {
      id: +item.reading_id,
      year: +item.year,
      yearOrder: +item.year_order,
      totalOrder: +item.total_order,
      book: item.book_id
    };
  }));

  await Reading.createEach(readingsData);
}

function getImportData() {
  if (!importDataPromise) {
    var xml = fs.readFileSync(path.join(__dirname, '../_import/Export.xml'), 'utf8');
    importDataPromise = new Promise((resolve, reject) => parseString(xml, { explicitArray: false }, (err, result) => err ? reject(err) : resolve(result)))
      .then(({ books_backup }) => books_backup);
  }

  return importDataPromise;
}

function getAuthorImage(imgName) {
  const imgPath = path.join(__dirname, `../_import/authors/${imgName}`);
  if (!fs.existsSync(imgPath)) {
    throw new Error(`Missing author image ${imgPath}`);
  }

  return dataUri(imgPath);
}

function getBookImage(imgName) {
  const imgPath = path.join(__dirname, `../_import/books/${imgName}`)
    .replace('Stratený', 'Strateny')
    // .replace('Gróf', 'Grвf')
    .replace('Jožo Ráž - Návrat', 'Jozo Ráz - Návrat')
    .replace('Neodovzdaný list', 'Neodovzdany list')
    // .replace('Víchor na Jamaike', 'Vбchor na Jamaike')
    .replace('Alexander Veľký', 'Alexander Velky');


  if (!fs.existsSync(imgPath)) {
    throw new Error(`Missing book image ${imgPath}`);
  }

  return dataUri(imgPath);
}
