export const PUSH_VIEW = 'PUSH_VIEW';

export function pushView(view) {
  return {
    type: PUSH_VIEW,
    payload: {
      view,
    },
  };
}

export const POP_VIEW = 'POP_VIEW';

export function popView() {
  return {
    type: POP_VIEW,
  };
}

export const SET_VIEW = 'SET_VIEW';

export function setView(view) {
  return {
    type: SET_VIEW,
    payload: {
      view,
    },
  };
}

// export const HIGHLIGHT_NODE = 'HIGHLIGHT_NODE';
//
// export function highlightNode(nodeName) {
//   return {
//     type: HIGHLIGHT_NODE,
//     payload: {
//       nodeName,
//     },
//   };
// }
