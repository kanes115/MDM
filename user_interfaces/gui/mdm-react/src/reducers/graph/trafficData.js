import _ from 'lodash';

import * as actionTypes from '../../actions';
import * as deploymentActionTypes from '../../actions/graph/deployment';

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
          },
        ],
        connections: [],
        class: 'danger',
        metadata: {},
      });
      newConnections.push({
        source: 'INTERNET',
        target: _.get(newMachine, 'name'),
        metrics: {},
        notices: [],
        class: 'normal',
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
      });
      connections.push({
        source: 'INTERNET',
        target: _.get(newService, 'name'),
        metrics: {},
        notices: [],
        class: 'normal',
      });

      servicesNode.nodes = services;
      servicesNode.connections = connections;
      const nodes = [...state.nodes];
      nodes[1] = servicesNode;

      return {
        ...state,
        nodes,
        updated: Date.now(),
      };
    }
    case actionTypes.CREATE_NEW_CONNECTION: {
      const newConnection = _.get(action, 'payload.connection', {});
      const servicesNode = { ...state.nodes[1] };
      const connections = [...servicesNode.connections];

      connections.push({
        source: _.get(newConnection, 'service_from'),
        target: _.get(newConnection, 'service_to'),
        metrics: {},
        notices: [],
        class: 'normal',
        // data: {
        //   port: _.get(newConnection, 'port'),
        // },
      });

      servicesNode.connections = connections;
      const nodes = [...state.nodes];
      nodes[1] = servicesNode;

      return {
        ...state,
        nodes,
        updated: Date.now(),
      };
    }

    case deploymentActionTypes.SYSTEM_DATA_COLLECTED: {
      const { connections, nodes } = state;

      // const newConnections = connections.map(connection => ({
      //   ...connection,
      //   metrics: {
      //     normal: 10.0,
      //     danger: 0.0,
      //     warning: 0.0,
      //   },
      // }));

      const newNodes = nodes.map((node, index) => {
        if (index === 0 || index === 1) {
          return node;
        }
        return {
          ...node,
          class: 'warning',
        };
      });

      return {
        ...state,
        nodes: newNodes,
        // connections: newConnections,
        updated: Date.now(),
      };
    }
    case deploymentActionTypes.BACK_TO_MODELLING: {
      const { connections, nodes } = state;

      // const newConnections = connections.map(connection => ({
      //   ...connection,
      //   metrics: {},
      // }));

      const newNodes = nodes.map((node, index) => {
        if (index === 0 || index === 1) {
          return node;
        }
        return {
          ...node,
          class: 'danger',
        };
      });

      return {
        ...state,
        nodes: newNodes,
        // connections: newConnections,
        updated: Date.now(),
      };
    }
    case deploymentActionTypes.SYSTEM_DEPLOYMENT_SUCCESS: {
      const { nodes } = state;

      const newNodes = nodes.map((node, index) => {
        if (index === 0 || index === 1) {
          return node;
        }
        return {
          ...node,
          class: 'normal',
        };
      });

      return {
        ...state,
        nodes: newNodes,
        updated: Date.now(),
      };
    }
    default:
      return state;
  }
};

export default trafficData;
