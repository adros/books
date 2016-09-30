module.exports.connections = {


  localPg: {
    adapter: 'sails-postgresql',
    host: 'localhost',
    user: 'test1',
    password: 'test1', // optional
    database: 'test1' //optional
  },
  herokuPg: {
    adapter: 'sails-postgresql',
    host: 'ec2-79-125-110-211.eu-west-1.compute.amazonaws.com',
    user: 'itrpiuckpxdghr',
    password: 't05HQjntAKlsgkJdnNcpjKxd2X', // optional
    database: 'd4aibuh32e6ule' //optional
  }

};
