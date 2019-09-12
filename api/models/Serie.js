module.exports = {

  dontUseObjectIds: true,

  attributes: {

    id: { type: 'string', columnName: '_id', autoIncrement: false, required: true  },
    title: { type: 'string', required: true },
    totalCount: { type: 'number', required: true },

    books: { collection: 'book', via: 'series' }

  },

};

