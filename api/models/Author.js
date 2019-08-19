module.exports = {

  dontUseObjectIds: true,

  attributes: {

    id: { type: 'number', columnName: '_id' },
    dateOfBirth: { type: 'string', required: true, columnType: 'date' },
    dateOfDeath: { type: 'string', required: false, columnType: 'date' },
    firstName: { type: 'string', required: true },
    lastName: { type: 'string', required: true },
    link: { type: 'string', required: false },
    nationality: { type: 'string', required: false },
    pictureUrl: { type: 'string', required: false },

  }

};

