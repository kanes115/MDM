import _ from 'lodash';

import {
  WEB_SOCKET_MESSAGE_RECEIVED,
} from '../actions/websocketActions';
import {
  systemDataCollected,
} from '../actions/graph/deployment';

export function onSocketOpen(emit) {
  return () => {
    console.log('opening socket');
  };
}

export function onSocketMessage(emit) {
  return (message) => {
    const messageBody = JSON.parse(message.data);
    console.log(messageBody)
    emit(messageBody);
  };
}

export function mapMessageToAction(message) {
  const { body, msg: type } = message;
  switch (type) {
    case 'collected': {
      return systemDataCollected(body);
    }
    default:
      return {
        type: WEB_SOCKET_MESSAGE_RECEIVED,
        payload: message,
      };
  }
}
