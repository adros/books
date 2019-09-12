const _ = require('lodash');

module.exports = {

  dontUseObjectIds: true,

  attributes: {

    id: { type: 'string', columnName: '_id', autoIncrement: false },
    dateOfBirth: { type: 'string', required: false, columnType: 'date' },
    dateOfDeath: { type: 'string', required: false, columnType: 'date' },
    firstName: { type: 'string', required: true },
    lastName: { type: 'string', required: true },
    link: { type: 'string', required: false },
    nationality: { type: 'string', required: false },
    pictureUrl: { type: 'string', required: false },
    pictureName: { type: 'string', required: false },

    books: { collection: 'book', via: 'authors' }

  },

  customToJSON: function () {
    return _.omit(this, ['pictureUrl']);
  }

};

