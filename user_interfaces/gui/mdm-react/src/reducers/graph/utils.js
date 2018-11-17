import _ from 'lodash';

export function serviceToNodeAndConnection(service) {
  return {
    node: {
      nodes: [],
      name: _.get(service, 'name'),
      renderer: 'focusedChild',
      maxVolume: 100000,
    },
    connectionTo: {
      source: 'INTERNET',
      target: _.get(service, 'name'),
      metrics: {},
      notices: [],
      class: 'normal',
    },
    connectionFrom: {
      source: _.get(service, 'name'),
      target: 'INTERNET',
      metrics: {},
      notices: [],
      class: 'normal',
    },
  };
}

export function machineToTrafficData(state, newMachine, status = 'danger') {
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
    class: status,
    data: {
      classPercents: {},
    },
    metadata: {
      id: _.get(newMachine, 'id'),
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
