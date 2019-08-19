const { parseString } = require('xml2js');
const fs = require('fs');
const path = require('path');

const dataUri = require('datauri').promise;

let importDataPromise;

module.exports.bootstrap = async function () {

  await Promise.all([
    importSeries(),
    importAuthors()
  ]);

};

async function importSeries() {
  if (await Serie.count() > 0) { return };

  var series = (await getImportData()).series.serie;

  await Serie.createEach(series.map(({ serie_id, title, total_count }) => ({
    id: serie_id,
    title,
    totalCount: total_count
  })));



}

async function importAuthors() {
  //if (await Author.count() > 0) { return };
  await Author.destroy({});

  var authors = (await getImportData()).authors.author;

  var authorsData = await Promise.all(authors.map(async function (item) {
    !item.picture_url && console.log(`skipping img for ${item.first_name} ${item.last_name}`);
    const pictureUrl = item.picture_url && (await getAuthorImage(item.picture_url));
    return {
      id: item.author_id,
      dateOfBirth: item.date_of_birth,
      dateOfDeath: item.date_of_death,
      firstName: item.first_name,
      lastName: item.last_name,
      link: item.link,
      nationality: item.nationality,
      pictureUrl
    };
  }));

  await Author.createEach(authorsData);
}

function getImportData() {
  if (!importDataPromise) {
    var xml = fs.readFileSync(path.join(__dirname, '../_import/Export.xml'), 'utf8');
    importDataPromise = new Promise((resolve, reject) => parseString(xml, { explicitArray: false }, (err, result) => err ? reject(err) : resolve(result)))
      .then(({ books_backup }) => books_backup);
  }

  return importDataPromise;
}


function getAuthorImage(link) {
  const imgPath = path.join(__dirname, `../_import/authors/${link.split('/').pop()}`);
  if(!fs.existsSync(imgPath)){
    throw new Error(`Missing image ${imgPath}`);
  }

  console.log(`creting datauri for img ${imgPath}`);
  return dataUri(imgPath);
}
