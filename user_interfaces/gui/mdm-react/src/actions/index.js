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
