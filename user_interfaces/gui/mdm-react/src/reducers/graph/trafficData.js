import _ from 'lodash';

import * as actionTypes from '../../actions';
import * as deploymentActionTypes from '../../actions/graph/deployment';

import {
  machineToTrafficData,
  serviceToTrafficData,
  connectionToTrafficData,
} from './utils';

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
      const newMachine = _.get(action, 'payload.machine', {});
      const {
        nodes: newNodes,
        connections: newConnections,
      } = machineToTrafficData(state, newMachine);

      return {
        ...state,
        updated: Date.now(),
        nodes: newNodes,
        connections: newConnections,
      };
    }
    case actionTypes.CREATE_NEW_SERVICE: {
      const newService = _.get(action, 'payload.service', {});
      const { nodes } = serviceToTrafficData(state, newService);

      return {
        ...state,
        nodes,
        updated: Date.now(),
      };
    }
    case actionTypes.CREATE_NEW_CONNECTION: {
      const newConnection = _.get(action, 'payload.connection', {});
      const { nodes } = connectionToTrafficData(state, newConnection);

      return {
        ...state,
        nodes,
        updated: Date.now(),
      };
    }

    case actionTypes.UPDATE_MACHINE: {
      const newMachineName = _.get(action, 'payload.newMachine.name', '');
      const oldMachineName = _.get(action, 'payload.oldMachine.name', '');
      const newNodes = [...state.nodes];
      const newConnections = [...state.connections];

      if (newMachineName !== oldMachineName) {
        const nodeIndex = _.findIndex(newNodes, node => node.name === oldMachineName);
        const connectionIndex = _.findIndex(
          newConnections,
          connection => connection.source === oldMachineName
            || connection.target === oldMachineName,
        );
        if (nodeIndex !== -1) {
          newNodes[nodeIndex].name = newMachineName;
        }
        if (connectionIndex !== -1) {
          if (newConnections[connectionIndex].source === oldMachineName) {
            newConnections[connectionIndex].source = newMachineName;
          }
          if (newConnections[connectionIndex].target === oldMachineName) {
            newConnections[connectionIndex].target = newMachineName;
          }
        }
      }

      return {
        ...state,
        updated: Date.now(),
        nodes: newNodes,
        connections: newConnections,
      };
    }

    case actionTypes.DELETE_MACHINE: {
      const deletedMachine = _.get(action, 'payload.machine');

      const newNodes = [...state.nodes];
      const newConnections = [...state.connections];

      const nodeIndex = _.findIndex(
        newNodes,
        node => node.name === deletedMachine.name,
      );
      const connectionIndex = _.findIndex(
        newConnections,
        connection => connection.target === deletedMachine.name,
      );

      if (nodeIndex !== -1) {
        newNodes.splice(nodeIndex, 1);
      }
      if (connectionIndex !== -1) {
        newConnections.splice(connectionIndex, 1);
      }

      return {
        ...state,
        nodes: newNodes,
        connections: newConnections,
        updated: Date.now(),
      };
    }

    case actionTypes.DELETE_SERVICE: {
      const deletedService = _.get(action, 'payload.service');

      const newNodes = [...state.nodes];
      const newServiceNode = { ...newNodes[1] };
      const newServices = [...newServiceNode.nodes];

      const serviceIndex = _.findIndex(
        newServices,
        service => service.name === deletedService.name,
      );
      const newConnections = _.reduce(
        newServiceNode.connections,
        (connections, connection) => {
          if (
            connection.target === deletedService.name
            || connection.source === deletedService.name
          ) {
            return connections;
          }
          connections.push(connection);
          return connections;
        },
        [],
      );

      if (serviceIndex !== -1) {
        newServices.splice(serviceIndex, 1);
      }

      newServiceNode.nodes = newServices;
      newServiceNode.connections = newConnections;
      newNodes[1] = newServiceNode;

      return {
        ...state,
        nodes: newNodes,
        updated: Date.now(),
      };
    }

    case actionTypes.DELETE_CONNECTION: {
      const deletedConnection = _.get(action, 'payload.connection');

      const newNodes = [...state.nodes];
      const newServiceNode = { ...newNodes[1] };
      const newConnections = [...newServiceNode.connections];

      const connectionIndex = _.findIndex(
        newConnections,
        connection => connection.source === deletedConnection.service_from
        && connection.target === deletedConnection.service_to,
      );

      if (connectionIndex !== -1) {
        newConnections.splice(connectionIndex, 1);
      }

      newServiceNode.connections = newConnections;
      newNodes[1] = newServiceNode;

      return {
        ...state,
        nodes: newNodes,
        updated: Date.now(),
      };
    }

    case actionTypes.INITIALIZE_LOADED_SYSTEM: {
      const system = _.get(action, 'payload.system');
      const machines = _.get(system, 'machines');
      const services = _.get(system, 'services');
      const connections = _.get(system, 'connections');

      const newState = { ...state };
      _.forEach(machines, (machine) => {
        const {
          nodes: newNodes,
          connections: newConnections,
        } = machineToTrafficData(newState, machine);

        newState.nodes = newNodes;
        newState.connections = newConnections;
      });
      _.forEach(services, (service) => {
        const { nodes: newNodes } = serviceToTrafficData(newState, service);

        newState.nodes = newNodes;
      });
      _.forEach(connections, (connection) => {
        const { nodes } = connectionToTrafficData(newState, connection);

        newState.nodes = nodes;
      });
      newState.updated = Date.now();

      return {
        ...newState,
      };
    }

    case deploymentActionTypes.SYSTEM_DATA_COLLECTED: {
      const { nodes } = state;

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
        updated: Date.now(),
      };
    }
    case deploymentActionTypes.BACK_TO_MODELLING: {
      const { nodes } = state;

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
