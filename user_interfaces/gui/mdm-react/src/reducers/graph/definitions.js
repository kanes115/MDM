const initialState = {
  detailedNode: {
    volume: {
      default: {
        top: {
          header: 'Connected',
          data: 'data.connected',
          format: '0',
        },
        bottom: {
          header: 'Deployed',
          data: 'data.deployed',
          format: '0',
        },
      },
      region: {
        top: {
          header: 'Connected',
          data: 'data.connected',
          format: '0',
        },
        bottom: {
          header: 'Deployed',
          data: 'data.deployed',
          format: '0',
        },
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
