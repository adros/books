module.exports = {

  dontUseObjectIds: true,

  attributes: {

    id: { type: 'string', columnName: '_id', autoIncrement: false },
    title: { type: 'string', required: true },
    totalCount: { type: 'number', required: true }

  },

};

