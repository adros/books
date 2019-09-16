module.exports = {

  dontUseObjectIds: true,

  attributes: {

    id: { type: 'number', required: true },
    title: { type: 'string', required: true },
    totalCount: { type: 'number', required: true },

    books: { collection: 'book', via: 'series' }

  },

};

