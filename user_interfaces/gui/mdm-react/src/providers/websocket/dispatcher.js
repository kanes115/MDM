import { socket }  from './init';

export default class WebSocketMessageDispatcher {
    constructor() {
        this.__socket = socket;
    }

    sendMessage(message) {
        this.__socket.send(message);
    }
}
