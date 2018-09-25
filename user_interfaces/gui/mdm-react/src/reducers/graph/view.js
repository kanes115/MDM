import * as actionTypes from '../../actions/graph/view';

const initialState = {
  searchTerm: '',
  matches: { total: -1, visible: -1 },
  redirectedFrom: null,
  currentView: ['system'],
  loaded: false,
};

const view = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PUSH_VIEW: {
      const nextView = [...state.currentView];
      nextView.push(action.payload.view);

      return {
        ...state,
        currentView: nextView,
      };
    }

    case actionTypes.POP_VIEW: {
      const nextView = [...state.currentView];
      nextView.pop();

      return {
        ...state,
        currentView: nextView,
      };
    }

    case actionTypes.SET_VIEW: {
      return {
        ...state,
        ...action.payload.view,
      };
    }

    // case actionTypes.HIGHLIGHT_NODE: {
    //   return {
    //     ...state,
    //     highlightedNode: action.payload.nodeName,
    //   };
    // }

    default:
      return state;
  }
};

export default view;
