import _ from 'lodash';

import { collectSystemData, deploySystem } from '../../providers/websocket';

export const START_GATHERING_DATA = 'START_GATHERING_DATA';

export function startGatheringData(activeSystem, systemName) {
  const machines = _.get(activeSystem, 'machines', []);
  const newMachines = machines.map((machine) => {
    if (machine.ip === '') {
      _.unset(machine, 'ip');
    }
    if (machine.domain === '') {
      _.unset(machine, 'domain');
    }
    return machine;
  });
  _.set(activeSystem, 'machines', newMachines);
  collectSystemData(activeSystem, systemName);

  return {
    type: START_GATHERING_DATA,
  };
}

export const SYSTEM_DATA_COLLECTED = 'SYSTEM_DATA_COLLECTED';

export function systemDataCollected(systemData) {
  const collectedData = _.reduce(
    _.get(systemData, 'collected_data', []),
    (accumulator, data) => {
      const machine = _.get(data, 'machine');
      const machineId = _.get(data, 'machine.id');

      accumulator[machineId] = machine;
      return accumulator;
    },
    {},
  );

  console.log(collectedData)
  return {
    type: SYSTEM_DATA_COLLECTED,
    payload: {
      collectedData,
    },
  };
}

export const SYSTEM_DATA_COLLECTION_ERROR = 'SYSTEM_DATA_COLLECTION_ERROR';

export function systemDataCollectionError(error) {
  return {
    type: SYSTEM_DATA_COLLECTION_ERROR,
    payload: {
      error,
    },
  };
}

export const START_DEPLOYING = 'START_DEPLOYING';

export function startDeploying() {
  deploySystem();

  return {
    type: START_DEPLOYING,
  };
}

export const SYSTEM_DEPLOYMENT_SUCCESS = 'SYSTEM_DEPLOYMENT_SUCCESS';

export function systemDeployed() {
  return {
    type: SYSTEM_DEPLOYMENT_SUCCESS,
  };
}

export const SYSTEM_DEPLOYMENT_ERROR = 'SYSTEM_DEPLOYMENT_ERROR';

export function systemDeploymentError(error) {
  return {
    type: SYSTEM_DEPLOYMENT_ERROR,
    payload: {
      error,
    },
  };
}

export const BACK_TO_MODELLING = 'BACK_TO_MODELLING';

export function backToDeployment() {
  return {
    type: BACK_TO_MODELLING,
  };
}
