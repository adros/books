module.exports.datastores = {

  default: {
    //adapter: 'sails-mongo',

    //url: 'mongodb://localhost:27017/booksdb'
    // url in local or production configs
    adapter: 'sails-postgresql',
    url: process.env.DATABASE_URL
  }

};
