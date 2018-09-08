export const INITIALIZE_WEB_SOCKETS_CHANNEL = 'INITIALIZE_WEB_SOCKETS_CHANNEL';

export function initializeWebSocketChannel() {
    return {
        type: INITIALIZE_WEB_SOCKETS_CHANNEL,
    };
}

export const WEB_SOCKET_MESSAGE_RECEIVED = 'WEB_SOCKET_MESSAGE_RECEIVED';
