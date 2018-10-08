import { combineReducers } from 'redux';

import definitions from './definitions';
import deployment from './deployment';
import trafficData from './trafficData';
import view from './view';

const graph = combineReducers({
  definitions,
  deployment,
  trafficData,
  view,
});

export default graph;
