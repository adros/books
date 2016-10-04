/**
 * Book.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
    },
    // serie: {
    //   model: 'serie'
    // },
    genre: {
      model: 'genre',
      required: true
    },
    authors: {
      collection: 'author',
      via: 'books',
      dominant: true
    },
    series: {
      collection: 'serie',
      via: 'books',
      dominant: true
    },
    readings: {
      collection: 'reading',
      via: 'book'
    }
  }
};
