import WebSocketMessageDispatcher from './dispatcher';

const dispatcher = new WebSocketMessageDispatcher();

export default function collectSystemData(system) {
  dispatcher.sendMessage(JSON.stringify({
    command_name: 'collect_data',
    body: system,
  }));
}
