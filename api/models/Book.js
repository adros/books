/**
 * Book.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  dontUseObjectIds: true,

  attributes: {

    id: { type: 'number', required: true },
    title: { type: 'string', required: true },
    original: { type: 'string', required: false },
    pages: { type: 'number', required: true },
    published: { type: 'number', required: false },
    description: { type: 'string', required: false },
    home: { type: 'boolean', required: false },
    genre: { type: 'string', required: true },
    pictureUrl: { type: 'string', required: false },
    pictureName: { type: 'string', required: false },

    series: { collection: 'serie', via: 'books' },
    authors: { collection: 'author', via: 'books' },
    readings: { collection: 'reading', via: 'book' },

    titleSearch: { type: 'string', required: true },
    originalSearch: { type: 'string', required: false }

  },

  customToJSON: function () {
    return _.omit(this, ['pictureUrl']);
  }

};

