var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var path = require("path");

var countries;

module.exports = {
  find: function(req, res) {

    getCountries()
      .then(countries => {
        if (req.query.name) {
          countries = countries.filter(c => c.name.indexOf(req.query.name.toUpperCase()) == 0);
        }
        if (req.query.limit) {
          countries = countries.slice(0, +req.query.limit);
        }
        return countries
      })
      .then(data => res.send(data))
      .catch(err => res.serverError(err));
  }
};

function getCountries() {
  if (countries) {
    return countries;
  }

  countries = fs.readdirAsync(path.join(__dirname, "../../.tmp/public/images/flags"))
    .filter(fileName => /\.png$/.test(fileName))
    .map(fileName => ({
      file: fileName,
      name: fileName.replace(".png", "").toUpperCase()
    }));

  return countries;
}
