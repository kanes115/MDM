import { socket } from './init';

export default class WebSocketMessageDispatcher {
  constructor() {
    this.socket = socket;
  }

  sendMessage(message) {
    this.socket.send(message);
  }
}
