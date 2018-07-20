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
    graph: {
        nodes: [],
        edges: [],
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
                graph: {
                    ...state.graph,
                    nodes: [
                        ...state.graph.nodes,
                        {
                            id: action.payload.service.name,
                            label: action.payload.service.name,
                            color: '#ff0000',
                        },
                    ],
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
                graph: {
                    ...state.graph,
                    edges: [
                        ...state.graph.edges,
                        {
                            id: `${action.payload.connection.service_from}->${action.payload.connection.service_to}`,
                            source: action.payload.connection.service_from,
                            target: action.payload.connection.service_to,
                            color: '#ff0000',
                        },
                    ],
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
        default:
            return state;
    }
};

export default rootReducer;