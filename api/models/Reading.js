/**
 * Reading.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    year: {
      type: 'integer',
      required: true
    },
    yearOrder: {
      type: 'integer',
      required: true
    },
    totalOrder: {
      type: 'integer',
      required: true
    },
    book: {
      model: 'book',
      required: true
    }

  }
};
