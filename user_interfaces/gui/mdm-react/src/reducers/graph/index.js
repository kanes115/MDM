import { combineReducers } from 'redux';

import definitions from './definitions';
import trafficData from './trafficData';

const graph = combineReducers({
  definitions,
  trafficData,
});

export default graph;
