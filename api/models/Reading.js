/**
 * Reading.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    id: { type: 'string', columnName: '_id', autoIncrement: false, required: true },
    year: { type: 'number', required: true },
    yearOrder: { type: 'number', required: true },
    totalOrder: { type: 'number', required: true },
    book: { model: 'book' }

  },

};

