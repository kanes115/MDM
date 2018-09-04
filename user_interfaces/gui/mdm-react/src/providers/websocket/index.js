import WebSocketMessageDispatcher from './dispatcher';

const dispatcher = new WebSocketMessageDispatcher();

export function deploySystem(system) {
    dispatcher.sendMessage({
        command_name: 'deploy',
        body: JSON.stringify(system),
    });
}
