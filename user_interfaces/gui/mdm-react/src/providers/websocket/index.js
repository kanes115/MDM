import WebSocketMessageDispatcher from './dispatcher';

const dispatcher = new WebSocketMessageDispatcher();

function collectSystemData(system) {
  dispatcher.sendMessage(JSON.stringify({
    command_name: 'collect_data',
    body: system,
  }));
}

function deploySystem() {
  dispatcher.sendMessage(JSON.stringify({
    command_name: 'deploy',
    body: {},
  }));
}

export {
  collectSystemData,
  deploySystem,
};
