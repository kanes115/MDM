import { eventChannel } from 'redux-saga';
import { put, call, take, takeEvery } from 'redux-saga/effects';
import {
    INITIALIZE_WEB_SOCKETS_CHANNEL,
} from '../actions/websocketActions';

import { socket } from '../providers/websocket/init';

import { mapMessageToAction, onSocketMessage, onSocketOpen } from './utils';

function createEventChannel(ws) {
    return eventChannel(emit => {
        ws.onopen = onSocketOpen(emit);

        ws.onmessage = onSocketMessage(emit);

        return () => {
            ws.close();
        };
    });
}

function* initializeWebSocketsChannel() {
    const channel = yield call(createEventChannel, socket);
    while (true) {
        const message = yield take(channel);
        const action = mapMessageToAction(message);
        yield put(action);
    }
}

export function* webSocketSaga() {
    yield [
        takeEvery(INITIALIZE_WEB_SOCKETS_CHANNEL, initializeWebSocketsChannel)
    ];
}
