import _ from 'lodash';
import * as actionTypes from '../actions';

import { system } from '../utils/jmmsr/schema';

const initialState = {
  activeSystemId: '',
  form: {
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
          formOpen: true,
          formType: action.payload.formType,
        },
      };
    case actionTypes.CLOSE_FORM:
      return {
        ...state,
        form: {
          ...state.form,
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
      const machinesCount = _.get(state, `systems.${state.activeSystemId}.machines.length`);
      const newMachine = _.cloneDeep(_.get(action, 'payload.machine'));
      newMachine.id = machinesCount;

      return {
        ...state,
        form: {
          ...state.form,
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
    default:
      return state;
  }
};

export default jmmsr;
