import { WEB_SOCKET_MESSAGE_RECEIVED } from '../actions/websocketActions';

export function onSocketOpen(emit) {
  return function () {
    console.log('opening socket');
  };
}

export function onSocketMessage(emit) {
  return function (message) {
    emit(JSON.parse(message.data));
  };
}

export function mapMessageToAction(message) {
  return {
    type: WEB_SOCKET_MESSAGE_RECEIVED,
    payload: message,
  };
}
