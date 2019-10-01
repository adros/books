const _ = require('lodash');

module.exports = {

  dontUseObjectIds: true,

  attributes: {

    id: { type: 'number', required: true },
    dateOfBirth: { type: 'string', required: false, allowNull: true },
    dateOfDeath: { type: 'string', required: false, allowNull: true },
    firstName: { type: 'string', required: true, },
    lastName: { type: 'string', required: true },
    link: { type: 'string', required: false },
    nationality: { type: 'string', required: false },
    pictureUrl: { type: 'string', required: false },
    pictureName: { type: 'string', required: false },

    books: { collection: 'book', via: 'authors' },
    
    firstNameSearch: { type: 'string', required: true, },
    lastNameSearch: { type: 'string', required: true }
  },

  customToJSON: function () {
    return _.omit(this, ['pictureUrl']);
  }

};

