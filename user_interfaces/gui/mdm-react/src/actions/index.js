import _ from 'lodash';

import { validateModel } from '../providers/websocket';

export const OPEN_FORM = 'OPEN_FORM';

export function openForm(formType, object = null) {
  return {
    type: OPEN_FORM,
    payload: {
      formType,
      object,
    },
  };
}

export const CLOSE_FORM = 'CLOSE_FORM';

export function closeForm() {
  return {
    type: CLOSE_FORM,
  };
}

export const CREATE_NEW_SYSTEM = 'CREATE_NEW_SYSTEM';

export function createNewSystem(systemId) {
  return {
    type: CREATE_NEW_SYSTEM,
    payload: {
      systemId,
    },
  };
}

export const CREATE_NEW_SERVICE = 'CREATE_NEW_SERVICE';

export function createNewService(service) {
  return {
    type: CREATE_NEW_SERVICE,
    payload: {
      service,
    },
  };
}

export const CREATE_NEW_CONNECTION = 'CREATE_NEW_CONNECTION';

export function createNewConnection(connection) {
  return {
    type: CREATE_NEW_CONNECTION,
    payload: {
      connection,
    },
  };
}

export const CREATE_NEW_MACHINE = 'CREATE_NEW_MACHINE';

export function createNewMachine(machine) {
  return {
    type: CREATE_NEW_MACHINE,
    payload: {
      machine,
    },
  };
}

export const UPDATE_SYSTEM_CONFIG = 'UPDATE_SYSTEM_CONFIG';

export function updateSystemConfig(config) {
  return {
    type: UPDATE_SYSTEM_CONFIG,
    payload: {
      config,
    },
  };
}

export const UPDATE_MACHINE = 'UPDATE_MACHINE';

export function updateMachine(newMachine, oldMachine) {
  return {
    type: UPDATE_MACHINE,
    payload: {
      newMachine,
      oldMachine,
    },
  };
}

export const UPDATE_SERVICE = 'UPDATE_SERVICE';

export function updateService(newService, oldService) {
  return {
    type: UPDATE_SERVICE,
    payload: {
      newService,
      oldService,
    },
  };
}

export const UPDATE_CONNECTION = 'UPDATE_CONNECTION';

export function updateConnection(newConnection, oldConnection) {
  return {
    type: UPDATE_CONNECTION,
    payload: {
      newConnection,
      oldConnection,
    },
  };
}

export const DELETE_MACHINE = 'DELETE_MACHINE';

export function deleteMachine(machine) {
  return {
    type: DELETE_MACHINE,
    payload: {
      machine,
    },
  };
}

export const DELETE_SERVICE = 'DELETE_SERVICE';

export function deleteService(service) {
  return {
    type: DELETE_SERVICE,
    payload: {
      service,
    },
  };
}

export const DELETE_CONNECTION = 'DELETE_CONNECTION';

export function deleteConnection(connection) {
  return {
    type: DELETE_CONNECTION,
    payload: {
      connection,
    },
  };
}

export const START_FILE_PROCESSING = 'START_FILE_PROCESSING';

export function startFileProcessing() {
  return {
    type: START_FILE_PROCESSING,
  };
}

export const FILE_PROCESSING_PROGRESS = 'FILE_PROCESSING_PROGRESS';

export function fileProcessingProgress(progressEvent) {
  return {
    type: FILE_PROCESSING_PROGRESS,
    payload: {
      progressEvent,
    },
  };
}

export const FILE_PROCESSING_SUCCESS = 'FILE_PROCESSING_SUCCESS';

export function fileProcessingSuccess(successEvent) {
  const result = _.get(successEvent, 'target.result', '');
  const model = JSON.parse(result);
  validateModel(model);

  return {
    type: FILE_PROCESSING_SUCCESS,
    payload: {
      successEvent,
    },
  };
}

export const FILE_PROCESSING_ERROR = 'FILE_PROCESSING_ERROR';

export function fileProcessingError(errorEvent) {
  return {
    type: FILE_PROCESSING_ERROR,
    payload: {
      errorEvent,
    },
  };
}

export const SYSTEM_CHECK_SUCCESS = 'SYSTEM_CHECK_SUCCESS';

export function systemCheckSuccess(body) {
  return {
    type: SYSTEM_CHECK_SUCCESS,
    payload: {
      body,
    },
  };
}

export const INITIALIZE_LOADED_SYSTEM = 'INITIALIZE_LOADED_SYSTEM';

export function initializeLoadedSystem(system) {
  return {
    type: INITIALIZE_LOADED_SYSTEM,
    payload: {
      system,
    },
  };
}

export const OPEN_METRICS_PANEL = 'OPEN_METRICS_PANEL';

export function openMetricsPanel() {
  return {
    type: OPEN_METRICS_PANEL,
  };
}

export const CLOSE_METRICS_PANEL = 'CLOSE_METRICS_PANEL';

export function closeMetricsPanel() {
  return {
    type: CLOSE_METRICS_PANEL,
  };
}

export const ACTIVE_SYSTEM_RECEIVED = 'ACTIVE_SYSTEM_RECEIVED';

export function activeSystemReceived(body) {
  return {
    type: ACTIVE_SYSTEM_RECEIVED,
    payload: {
      isDeployed: _.get(body, 'is_deployed', false),
      isUp: _.get(body, 'is_up', false),
      system: _.get(body, 'jmmsr', {}),
      systemName: _.get(body, 'system_name', 'system'),
      servicesDown: _.get(body, 'services_down', []),
      collectedData: _.get(body, 'collected_data', []),
    },
  };
}

export const CLEAR_MODEL = 'CLEAR_MODEL';

export function clearModel(name) {
  return {
    type: CLEAR_MODEL,
    payload: {
      name,
    },
  };
}

export const GET_ACTIVE_SYSTEM = 'GET_ACTIVE_SYSTEM';

export function getActiveSystemInit() {
  return {
    type: GET_ACTIVE_SYSTEM,
  };
}

export const CLOSE_STOPPED_SYSTEM_INFO = 'CLOSE_STOPPED_SYSTEM_INFO';

export function closeStoppedSystemInfo() {
  return {
    type: CLOSE_STOPPED_SYSTEM_INFO,
  };
}
