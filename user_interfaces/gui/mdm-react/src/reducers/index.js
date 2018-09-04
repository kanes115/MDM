import _ from 'lodash';
import * as actionTypes from '../actions';

import {system} from '../utils/jmmsr/schema';

const initialState = {
    activeSystemId: '',
    form: {
        connectionForm: {
            selectingSource: false,
            selectingTarget: false,
            service_from: '',
            service_to: '',
        },
        formOpen: false,
        formType: '',
    },
    systems: {},
};

const rootReducer = (state = initialState, action) => {
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
            const newSystems = {...state.systems};
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
        case actionTypes.TOGGLE_SOURCE_SELECTION:
            return {
                ...state,
                form: {
                    ...state.form,
                    connectionForm: {
                        ...state.form.connectionForm,
                        selectingSource: !state.form.connectionForm.selectingSource,
                    },
                },
            };
        case actionTypes.TOGGLE_TARGET_SELECTION:
            return {
                ...state,
                form: {
                    ...state.form,
                    connectionForm: {
                        ...state.form.connectionForm,
                        selectingTarget: !state.form.connectionForm.selectingTarget,
                    },
                },
            };
        case actionTypes.SELECT_CONNECTION_SOURCE:
            return {
                ...state,
                form: {
                    ...state.form,
                    connectionForm: {
                        ...state.form.connectionForm,
                        selectingSource: false,
                        service_from: action.payload.serviceName,
                    },
                },
            };
        case actionTypes.SELECT_CONNECTION_TARGET:
            return {
                ...state,
                form: {
                    ...state.form,
                    connectionForm: {
                        ...state.form.connectionForm,
                        selectingTarget: false,
                        service_to: action.payload.serviceName,
                    },
                },
            };
        case actionTypes.CREATE_NEW_CONNECTION:
            return {
                ...state,
                form: {
                    ...state.form,
                    connectionForm: {
                        selectingSource: false,
                        selectingTarget: false,
                        service_from: '',
                        service_to: '',
                    },
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
        case actionTypes.CREATE_NEW_MACHINE:
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
                            _.cloneDeep(action.payload.machine),
                        ],
                    },
                },
            };
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

export default rootReducer;
