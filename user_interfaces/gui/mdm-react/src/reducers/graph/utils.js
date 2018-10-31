import _ from 'lodash';

export function machineToTrafficData(state, newMachine) {
  const newNodes = [...state.nodes];
  const newConnections = [...state.connections];

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
    maxVolume: 10000,
    connections: [],
    class: 'danger',
    data: {
      classPercents: {},
    },
    metadata: {
      cpu: 0,
      mem: 0,
    },
  });
  newConnections.push({
    source: 'INTERNET',
    target: _.get(newMachine, 'name'),
    metrics: {},
    notices: [],
    class: 'normal',
  });
  newConnections.push({
    source: _.get(newMachine, 'name'),
    target: 'INTERNET',
    metrics: {},
    notices: [],
    class: 'normal',
  });

  return {
    nodes: newNodes,
    connections: newConnections,
  };
}

export function serviceToTrafficData(state, newService) {
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
    nodes,
  };
}

export function connectionToTrafficData(state, newConnection) {
  const servicesNode = { ...state.nodes[1] };
  const connections = [...servicesNode.connections];

  connections.push({
    source: _.get(newConnection, 'service_from'),
    target: _.get(newConnection, 'service_to'),
    metrics: {},
    notices: [],
    class: 'normal',
    metadata: {
      port: _.get(newConnection, 'port'),
    },
  });

  servicesNode.connections = connections;
  const nodes = [...state.nodes];
  nodes[1] = servicesNode;

  return {
    nodes,
  };
}
