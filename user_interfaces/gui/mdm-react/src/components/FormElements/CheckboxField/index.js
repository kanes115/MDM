import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from 'informed';

import './checkbox-field.css';

const CheckboxField = ({
                        id,
                        field,
                        label,
                    }) => (
    <div className="mdm-form-checkbox-field">
        <label htmlFor={id}>
            {label}
            </label>
        <Checkbox field={field}
                  id={id}/>
    </div>
);

CheckboxField.propTypes = {
    id: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};
CheckboxField.defaultProps = {};

export default CheckboxField;
