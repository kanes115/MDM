import { combineReducers } from 'redux';

import trafficData from './trafficData';

const graph = combineReducers({
    trafficData,
});

export default graph;
