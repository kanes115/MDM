import { combineReducers } from 'redux';

import jmmsr from './jmmsr';
import graph from './graph';

const rootReducer = combineReducers({
    graph,
    jmmsr,
});

export default rootReducer;
