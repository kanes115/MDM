import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../../reducers';
import { webSocketSaga } from '../../sagas';

const sagaMiddleware = createSagaMiddleware();
const middleware = [
  thunk,
  sagaMiddleware,
];

const store = createStore(
  rootReducer,
  applyMiddleware(...middleware),
);
sagaMiddleware.run(webSocketSaga);

export default store;
