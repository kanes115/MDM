import _ from 'lodash';

import * as actionTypes from '../../actions';
import * as deploymentActionTypes from '../../actions/graph/deployment';
import * as metricsActionTypes from '../../actions/metrics';

import {
  serviceToNodeAndConnection,
  machineToTrafficData,
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
        classPercents: {},
      },
    },
  ],
  connections: [],
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

    case actionTypes.INITIALIZE_LOADED_SYSTEM: {
      const system = _.get(action, 'payload.system');
      const machines = _.get(system, 'machines');

      const newState = { ...state };
      _.forEach(machines, (machine) => {
        const {
          nodes: newNodes,
          connections: newConnections,
        } = machineToTrafficData(newState, machine);

        newState.nodes = newNodes;
        newState.connections = newConnections;
      });
      newState.updated = Date.now();

      return {
        ...newState,
      };
    }

    case deploymentActionTypes.SYSTEM_DATA_COLLECTED: {
      const { nodes } = state;

      const newNodes = nodes.map((node, index) => {
        if (index === 0) {
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
        if (index === 0) {
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
        if (index === 0) {
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

    case actionTypes.REORGANIZE_MACHINES: {
      const activeSystemServices = _.get(action, 'payload.activeSystem.services', []);
      const newNodes = [...state.nodes];
      const newConnections = [...state.connections];

      const groupedServices = _.groupBy(
        activeSystemServices,
        service => _.get(service, 'requirements.available_machines.0'),
      );
      newNodes.forEach((node, index) => {
        if (index > 0) {
          const machineId = _.get(node, 'metadata.id');
          const servicesForMachine = _.get(groupedServices, `${machineId}`, []);
          servicesForMachine.forEach((service) => {
            const {
              node: serviceAsNode,
              connectionFrom,
              connectionTo,
            } = serviceToNodeAndConnection(service);
            node.nodes.push(serviceAsNode);
            node.connections.push(connectionFrom);
            node.connections.push(connectionTo);
          });
        }
      });

      return {
        ...state,
        nodes: newNodes,
        connections: newConnections,
        updated: Date.now(),
      };
    }

    case metricsActionTypes.MACHINE_METRICS_RECEIVED: {
      const machines = _.get(action, 'payload.eventBody.machines', []);
      const newNodes = [...state.nodes];
      const newConnections = [...state.connections];

      machines.forEach((machine) => {
        const index = _.findIndex(newNodes, node => node.name === machine.machine_name);
        if (index !== -1) {
          const cpu = _.get(machine, 'metrics.cpu.val', 0);
          const mem = _.get(machine, 'metrics.mem.val', 0);

          newNodes[index].metadata = {
            ...newNodes[index].metadata,
            cpu: cpu / 100,
            mem: mem / 100,
          };
        }

        const connection1Index = _.findIndex(
          newConnections,
          connection => connection.target === machine.machine_name,
        );
        if (connection1Index !== -1) {
          const net = _.get(machine, 'metrics.net_in.val', 0);

          newConnections[connection1Index].metrics = {
            danger: 0,
            normal: net,
            warning: 0,
          };
        }
        const connection2Index = _.findIndex(
          newConnections,
          connection => connection.source === machine.machine_name,
        );
        if (connection2Index !== -1) {
          const net = _.get(machine, 'metrics.net_out.val', 0);

          newConnections[connection2Index].metrics = {
            danger: 0,
            normal: net,
            warning: 0,
          };
        }
      });

      return {
        ...state,
        nodes: newNodes,
        connections: newConnections,
        updated: Date.now(),
      };
    }

    case metricsActionTypes.SERVICE_METRICS_RECEIVED: {
      const services = _.get(action, 'payload.eventBody.services', []);
      const newNodes = [...state.nodes];

      services.forEach((service) => {
        const serviceName = _.get(service, 'service_name');
        const netIn = _.get(service, 'metrics.net_in.val', 0);
        const netOut = _.get(service, 'metrics.net_out.val', 0);

        newNodes.forEach((machine) => {
          machine.connections.forEach((connection) => {
            if (connection.source === serviceName && connection.target === 'INTERNET') {
              _.set(connection, 'metrics', {
                danger: 0,
                normal: netOut,
                warning: 0,
              });
            }
            if (connection.target === serviceName && connection.source === 'INTERNET') {
              _.set(connection, 'metrics', {
                danger: 0,
                normal: netIn,
                warning: 0,
              });
            }
          });
        });
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
