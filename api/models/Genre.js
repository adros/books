/**
 * Genre.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true
    }
  },

  initData: { //used by bootsrap and as impl alias in import controller
    1: "Cestopis",
    2: "Detektívny Román",
    3: "Dobrodružný Román",
    4: "Dokument",
    5: "Historický Román",
    6: "Kriminálny Román",
    7: "Legendy",
    8: "Literatúra faktu",
    9: "Odborný cestopis",
    10: "Profesný román",
    11: "Román",
    12: "Rozprávka",
    13: "Zbierka fejtónov",
    14: "Zbierka poviedok",
    15: "Zbierka vtipov",
    16: "Životopis"
  }
};
