import _ from 'lodash';

import * as actionTypes from '../../actions';

const initialState = {
  renderer: 'global',
  name: '',
  entryNode: 'INTERNET',
  nodes: [
    {
      renderer: 'region',
      maxVolume: 100000,
      name: 'INTERNET',
      nodes: [],
      connections: [],
      class: 'normal',
      metadata: {},
      data: {
        connected: 1,
        deployed: 1,
      },
    },
    {
      renderer: 'region',
      maxVolume: 100000,
      name: 'Services',
      nodes: [
        {
          nodes: [],
          name: 'INTERNET',
          renderer: 'focusedChild',
        },
      ],
      connections: [],
      class: 'normal',
      metadata: {},
      data: {
        connected: 0,
        deployed: 0,
      },
    },
  ],
  connections: [
    {
      source: 'INTERNET',
      target: 'Services',
      metrics: {},
      notices: [],
      class: 'normal',
      updated: Date.now(),
    },
  ],
  updated: Date.now(),
};

const trafficData = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_NEW_SYSTEM:
      return {
        ...state,
        name: action.payload.systemId,
        updated: Date.now(),
      };
    case actionTypes.CREATE_NEW_MACHINE: {
      const newNodes = [...state.nodes];
      const newConnections = [...state.connections];
      const newMachine = _.get(action, 'payload.machine', {});
      newNodes.push({
        renderer: 'region',
        name: _.get(newMachine, 'name'),
        nodes: [
          {
            nodes: [],
            name: 'INTERNET',
            renderer: 'focusedChild',
            maxVolume: 100000,
            updated: Date.now(),
          },
        ],
        connections: [],
        class: 'danger',
        metadata: {},
        updated: Date.now(),
        data: {
          connected: 0,
          deployed: 0,
        },
      });
      newConnections.push({
        source: 'INTERNET',
        target: _.get(newMachine, 'name'),
        metrics: {},
        notices: [],
        class: 'normal',
        updated: Date.now(),
      });

      return {
        ...state,
        updated: Date.now(),
        nodes: newNodes,
        connections: newConnections,
      };
    }
    case actionTypes.CREATE_NEW_SERVICE: {
      const newService = _.get(action, 'payload.service', {});
      const servicesNode = { ...state.nodes[1] };
      const services = [...servicesNode.nodes];
      const connections = [...servicesNode.connections];

      services.push({
        nodes: [],
        name: _.get(newService, 'name'),
        renderer: 'focusedChild',
        maxVolume: 100000,
        updated: Date.now(),
      });
      connections.push({
        source: 'INTERNET',
        target: _.get(newService, 'name'),
        metrics: {},
        notices: [],
        class: 'normal',
        updated: Date.now(),
      });

      servicesNode.nodes = services;
      servicesNode.connections = connections;
      servicesNode.updated = Date.now();
      const nodes = [...state.nodes];
      nodes[1] = servicesNode;

      return {
        ...state,
        nodes,
        updated: Date.now(),
      };
    }
    default:
      return state;
  }
};

export default trafficData;
