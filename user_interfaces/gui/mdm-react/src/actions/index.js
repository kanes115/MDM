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

export function updateMachine(machine) {
  return {
    type: UPDATE_MACHINE,
    payload: {
      machine,
    },
  };
}

export const UPDATE_SERVICE = 'UPDATE_SERVICE';

export function updateService(service) {
  return {
    type: UPDATE_SERVICE,
    payload: {
      service,
    },
  };
}

export const UPDATE_CONNECTION = 'UPDATE_CONNECTION';

export function updateConnection(connection, oldConnection) {
  return {
    type: UPDATE_CONNECTION,
    payload: {
      connection,
      oldConnection,
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
