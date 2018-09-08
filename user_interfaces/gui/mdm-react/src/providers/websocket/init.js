const webSocketUrl = process.env.REACT_APP_WS_URL;

export const socket = new WebSocket(webSocketUrl);
