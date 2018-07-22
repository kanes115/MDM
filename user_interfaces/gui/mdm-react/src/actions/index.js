export const OPEN_FORM = 'OPEN_FORM';

export function openForm(formType) {
    return {
        type: OPEN_FORM,
        payload: {
            formType,
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
