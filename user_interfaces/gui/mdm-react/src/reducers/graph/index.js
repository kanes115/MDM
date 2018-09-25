import { combineReducers } from 'redux';

import definitions from './definitions';
import trafficData from './trafficData';
import view from './view';

const graph = combineReducers({
  definitions,
  trafficData,
  view,
});

export default graph;
