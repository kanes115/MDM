import _ from 'lodash';
import * as actionTypes from '../actions';
import * as deploymentActionTypes from '../actions/graph/deployment';

import { system } from '../utils/jmmsr/schema';

const initialState = {
  activeSystemId: '',
  fileLoader: {
    error: null,
    file: null,
    loading: false,
    progress: 0,
  },
  form: {
    formObject: null,
    formOpen: false,
    formType: '',
  },
  systems: {},
};

const jmmsr = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.OPEN_FORM:
      return {
        ...state,
        form: {
          ...state.form,
          formObject: action.payload.object,
          formOpen: true,
          formType: action.payload.formType,
        },
      };
    case actionTypes.CLOSE_FORM:
      return {
        ...state,
        form: {
          ...state.form,
          formObject: null,
          formOpen: false,
          formType: '',
        },
      };

    case actionTypes.CREATE_NEW_SYSTEM:
      const newSystems = { ...state.systems };
      const createdSystem = _.cloneDeep(system);
      _.set(createdSystem, 'name', action.payload.systemId);
      _.set(newSystems, action.payload.systemId, createdSystem);

      return {
        ...state,
        activeSystemId: action.payload.systemId,
        form: {
          ...state.form,
          formObject: null,
          formOpen: false,
          formType: '',
        },
        systems: newSystems,
      };

    case actionTypes.CREATE_NEW_SERVICE:
      return {
        ...state,
        form: {
          ...state.form,
          formObject: null,
          formOpen: false,
          formType: '',
        },
        systems: {
          ...state.systems,
          [state.activeSystemId]: {
            ...state.systems[state.activeSystemId],
            services: [
              ...state.systems[state.activeSystemId].services,
              _.cloneDeep(action.payload.service),
            ],
          },
        },
      };
    case actionTypes.CREATE_NEW_CONNECTION:
      return {
        ...state,
        form: {
          ...state.form,
          formObject: null,
          formOpen: false,
          formType: '',
        },
        systems: {
          ...state.systems,
          [state.activeSystemId]: {
            ...state.systems[state.activeSystemId],
            connections: [
              ...state.systems[state.activeSystemId].connections,
              _.cloneDeep(action.payload.connection),
            ],
          },
        },
      };
    case actionTypes.CREATE_NEW_MACHINE: {
      const newMachine = _.cloneDeep(_.get(action, 'payload.machine'));
      newMachine.id = (new Date()).getTime();

      return {
        ...state,
        form: {
          ...state.form,
          formObject: null,
          formOpen: false,
          formType: '',
        },
        systems: {
          ...state.systems,
          [state.activeSystemId]: {
            ...state.systems[state.activeSystemId],
            machines: [
              ...state.systems[state.activeSystemId].machines,
              newMachine,
            ],
          },
        },
      };
    }
    case actionTypes.UPDATE_SYSTEM_CONFIG:
      return {
        ...state,
        form: {
          ...state.form,
          formObject: null,
          formOpen: false,
          formType: '',
        },
        systems: {
          ...state.systems,
          [state.activeSystemId]: {
            ...state.systems[state.activeSystemId],
            config: {
              ...state.systems[state.activeSystemId].config,
              ...action.payload.config,
            },
          },
        },
      };
    case actionTypes.UPDATE_MACHINE: {
      const machines = [...state.systems[state.activeSystemId].machines];
      const updatedMachineId = _.get(action, 'payload.machine.id');
      const index = _.findIndex(machines, machine => machine.id === updatedMachineId);

      machines[index] = _.get(action, 'payload.machine');

      return {
        ...state,
        form: {
          ...state.form,
          formObject: null,
          formOpen: false,
          formType: '',
        },
        systems: {
          ...state.systems,
          [state.activeSystemId]: {
            ...state.systems[state.activeSystemId],
            machines,
          },
        },
      };
    }
    case actionTypes.UPDATE_SERVICE: {
      const services = [...state.systems[state.activeSystemId].services];
      const updatedServiceName = _.get(action, 'payload.service.name');
      const index = _.findIndex(services, service => service.name === updatedServiceName);

      services[index] = _.get(action, 'payload.service');

      return {
        ...state,
        form: {
          ...state.form,
          formObject: null,
          formOpen: false,
          formType: '',
        },
        systems: {
          ...state.systems,
          [state.activeSystemId]: {
            ...state.systems[state.activeSystemId],
            services,
          },
        },
      };
    }

    case deploymentActionTypes.SYSTEM_DATA_COLLECTED: {
      const { activeSystemId } = state;
      const machines = _.get(state, `systems.${activeSystemId}.machines`);
      const { payload: { collectedData } } = action;

      const newMachines = machines.map(machine => ({
        ...machine,
        resources: {
          ...(_.get(collectedData, `${machine.id}.resources`)),
        },
      }));
      console.log('!!!', newMachines)

      return {
        ...state,
        systems: {
          ...state.systems,
          [activeSystemId]: {
            ...state.systems[activeSystemId],
            machines: newMachines,
          },
        },
      };
    }

    case actionTypes.START_FILE_PROCESSING: {
      return {
        ...state,
        fileLoader: {
          ...state.fileLoader,
          error: null,
          file: null,
          loading: true,
          progress: 0,
        },
      };
    }
    case actionTypes.FILE_PROCESSING_PROGRESS: {
      const event = _.get(action, 'payload.progressEvent');
      const lengthComputable = _.get(event, 'lengthComputable', false);
      const loaded = _.get(event, 'loaded', 0);
      const total = _.get(event, 'total', 0);

      if (lengthComputable) {
        return {
          ...state,
          fileLoader: {
            ...state.fileLoader,
            progress: loaded / total,
          },
        };
      }

      return state;
    }
    case actionTypes.FILE_PROCESSING_SUCCESS: {
      const event = _.get(action, 'payload.successEvent');
      const result = _.get(event, 'target.result', '');
      const file = JSON.parse(result);

      return {
        ...state,
        fileLoader: {
          ...state.fileLoader,
          error: null,
          file,
          loading: false,
          progress: 1,
        },
      };
    }
    case actionTypes.FILE_PROCESSING_ERROR: {
      const event = _.get(action, 'payload.errorEvent');

      return {
        ...state,
        fileLoader: {
          ...state.fileLoader,
          error: event,
          file: null,
          loading: false,
          progress: 1,
        },
      };
    }

    default:
      return state;
  }
};

export default jmmsr;
