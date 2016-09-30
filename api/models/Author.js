/**
 * Author.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    dateOfBirth: {
      type: 'datetime'
    },
    dateOfDeatdh: {
      type: 'datetime'
    },
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    link: {
      type: 'url'
    },
    pictureUrl: {
      type: 'url'
    },
    nationality: {
      type: 'string'
    }
  }

};
