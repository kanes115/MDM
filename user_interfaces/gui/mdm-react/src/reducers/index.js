import * as actionTypes from '../actions';

const initialState = {
    form: {
        formOpen: false,
        formType: null,
    },
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
                    formType: null,
                },
            };
        default:
            return state;
    }
};

export default rootReducer;