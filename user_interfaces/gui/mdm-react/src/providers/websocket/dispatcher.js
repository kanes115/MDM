import { socket } from './init';

export default class WebSocketMessageDispatcher {
  constructor() {
    this.socket = socket;
  }

  sendMessage(message) {
    console.log('sent', message)
    this.socket.send(message);
  }
}
