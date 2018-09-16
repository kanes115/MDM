function getDefaultDetailedNode() {
  return {
    volume: {
      default: {
        top: {
          header: 'Not deployed',
          data: '',
        },
        bottom: {
          header: '',
          data: '',
        },
      },
    },
  };
}

export default {
  getDefaultDetailedNode,
};
