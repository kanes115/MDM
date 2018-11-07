import {
  WEB_SOCKET_MESSAGE_RECEIVED,
} from '../actions/websocketActions';
import {
  systemDataCollected,
  systemDataCollectionError,
  systemDeployed,
  systemDeploymentError,
} from '../actions/graph/deployment';
import {
  systemCheckSuccess,
} from '../actions';
import {
  machineMetricsReceived,
  serviceMetricsReceived,
} from '../actions/metrics';

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
  const { body, msg: type, event_name: eventType } = message;

  if (eventType) {
    switch (eventType) {
      case 'machine_metrics': {
        return machineMetricsReceived(body);
      }
      case 'service_metrics': {
        return serviceMetricsReceived(body);
      }
      default:
        break;
    }
  }

  switch (type) {
    case 'collected': {
      return systemDataCollected(body);
    }
    case 'deployed': {
      return systemDeployed();
    }
    case 'checked': {
      return systemCheckSuccess(body);
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
