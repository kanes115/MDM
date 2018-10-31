const initialState = {
  detailedNode: {
    volume: {
      default: {
        top: {
          header: '% CPU',
          data: 'metadata.cpu',
          format: '0.00%',
        },
        bottom: {
          header: '% Memory',
          data: 'metadata.mem',
          format: '0.00%',
        },
        donut: {},
        arc: {},
      },
      entry: {
        top: {},
        bottom: {},
        donut: {},
        arc: {},
      },
      region: {
        top: {},
        bottom: {},
        donut: {},
        arc: {},
      },
    },
  },
};

const definitions = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default definitions;
