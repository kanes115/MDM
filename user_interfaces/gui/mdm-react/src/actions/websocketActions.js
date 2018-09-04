export const INITIALIZE_WEB_SOCKETS_CHANNEL = 'INITIALIZE_WEB_SOCKETS_CHANNEL';

export function initalizeWebSocketChannel() {
    return {
        type: INITIALIZE_WEB_SOCKETS_CHANNEL,
    };
}

export const WEBSOCKET_MESSAGE_RECEIVED = 'WEBSOCKET_MESSAGE_RECEIVED';
