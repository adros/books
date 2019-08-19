module.exports = {

  dontUseObjectIds: true,

  attributes: {

    id: { type: 'number', columnName: '_id' },
    title: { type: 'string', required: true },
    totalCount: { type: 'number', required: true }

  },

};

