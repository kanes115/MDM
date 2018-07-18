import _ from 'lodash';
import * as actionTypes from '../actions';

import {system} from '../utils/jmmsr/schema';

const initialState = {
    activeSystemId: '',
    form: {
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
        default:
            return state;
    }
};

export default rootReducer;