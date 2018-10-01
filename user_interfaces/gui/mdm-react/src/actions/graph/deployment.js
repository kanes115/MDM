import _ from 'lodash';

import collectSystemData from '../../providers/websocket';

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

  return {
    type: SYSTEM_DATA_COLLECTED,
    payload: {
      collectedData,
    },
  };
}

export const START_GATHERING_DATA = 'START_GATHERING_DATA';

export function startGatheringData(activeSystem) {
  collectSystemData(activeSystem);

  return {
    type: START_GATHERING_DATA,
  };
}

export const START_DEPLOYING = 'START_DEPLOYING';

export const SYSTEM_DEPLOYMENT_SUCCESS = 'SYSTEM_DEPLOYMENT_SUCCESS';
