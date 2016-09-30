var Promise = require("bluebird");

module.exports = {
  import: function(req, res, next) {
    return Author.destroy({})
      .then(() => {
        return Promise.map(req.body.books_backup.authors[0].author, author => {
          var data = {
            firstName: author.first_name[0],
            lastName: author.last_name[0]
          };
          return Author.create(data);
        }, {
          concurrency: 10
        })
      })
      .then(data => res.send(data))
      .catch(err => res.serverError(err));
  },
  bye: function(req, res) {
    return res.redirect('http://www.sayonara.com');
  }
};
