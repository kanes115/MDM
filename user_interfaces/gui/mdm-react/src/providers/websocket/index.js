import WebSocketMessageDispatcher from './dispatcher';

const dispatcher = new WebSocketMessageDispatcher();

function collectSystemData(system, systemName) {
  dispatcher.sendMessage(JSON.stringify({
    command_name: 'collect_data',
    body: {
      jmmsr: system,
      system_name: systemName,
    },
  }));
}

function deploySystem() {
  dispatcher.sendMessage(JSON.stringify({
    command_name: 'deploy',
    body: {},
  }));
}

function getActiveSystem() {
  dispatcher.sendMessage(JSON.stringify({
    command_name: 'get_active_system',
    body: {},
  }));
}

function validateModel(model) {
  dispatcher.sendMessage(JSON.stringify({
    command_name: 'check_correctness',
    body: model,
  }));
}

function stopSystem() {
  dispatcher.sendMessage(JSON.stringify({
    command_name: 'stop_system',
    body: {},
  }));
}

export {
  collectSystemData,
  deploySystem,
  getActiveSystem,
  stopSystem,
  validateModel,
};
