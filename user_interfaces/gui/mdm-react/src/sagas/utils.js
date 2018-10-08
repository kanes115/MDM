import {
  WEB_SOCKET_MESSAGE_RECEIVED,
} from '../actions/websocketActions';
import {
  systemDataCollected,
  systemDataCollectionError,
  systemDeployed,
  systemDeploymentError,
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

function mapErrorToAction(message) {
  const { body, code, command_name: commandName } = message;

  switch (commandName) {
    case 'collect_data':
      return systemDataCollectionError({
        body,
        code,
      });
    case 'deploy':
      return systemDeploymentError({
        body,
        code,
      });
    default:
      return {
        type: WEB_SOCKET_MESSAGE_RECEIVED,
        payload: message,
      };
  }
}

export function mapMessageToAction(message) {
  const { body, msg: type } = message;
  switch (type) {
    case 'collected': {
      return systemDataCollected(body);
    }
    case 'deployed': {
      return systemDeployed();
    }
    case 'error': {
      return mapErrorToAction(message);
    }
    default:
      return {
        type: WEB_SOCKET_MESSAGE_RECEIVED,
        payload: message,
      };
  }
}
