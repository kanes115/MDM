import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'informed';

import './input-field.css';

const InputField = ({
                        id,
                        field,
                        label,
                        type,
                    }) => (
    <div className="mdm-form-input-field">
        <label htmlFor={id}>
            {label}
        </label>
        <Text id={id}
              field={field}
              type={type}/>
    </div>
);

InputField.propTypes = {
    id: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
        'text',
        'number',
    ]),
};
InputField.defaultProps = {
    type: 'text',
};

export default InputField;
