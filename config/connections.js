module.exports.connections = {


  localDiskDb: {
    adapter: 'sails-disk'
  },

  somePostgresqlServer: {
    adapter: 'sails-postgresql',
    host: 'localhost',
    user: 'test1',
    password: 'test1', // optional
    database: 'test1' //optional
  }
};
