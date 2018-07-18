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

export const SELECT_CONNECTION_SOURCE = 'SELECT_CONNECTION_SOURCE';

export function selectConnectionSource(serviceName) {
    return {
        type: SELECT_CONNECTION_SOURCE,
        payload: {
            serviceName,
        },
    };
}

export const SELECT_CONNECTION_TARGET = 'SELECT_CONNECTION_TARGET';

export function selectConnectionTarget(serviceName) {
    return {
        type: SELECT_CONNECTION_TARGET,
        payload: {
            serviceName,
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
