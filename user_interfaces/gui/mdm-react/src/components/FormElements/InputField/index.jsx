import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'informed';
import c from 'classnames';

import './input-field.css';

const InputField = ({
  id,
  error,
  field,
  label,
  type,
  validate,
  validateOnBlur,
  validateOnChange,
}) => (
  <div
    className={c(
      'mdm-form-input-field',
      {
        'error-occurred': !!error,
      },
    )}
  >
    <label htmlFor={id}>
      {label}
    </label>
    <Text
      id={id}
      field={field}
      type={type}
      validate={validate}
      validateOnBlur={validateOnBlur}
      validateOnChange={validateOnChange}
    />
    <div className="error">
      {error}
    </div>
  </div>
);

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  error: PropTypes.string,
  field: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'text',
    'number',
  ]),
  validate: PropTypes.func,
  validateOnBlur: PropTypes.bool,
  validateOnChange: PropTypes.bool,
};
InputField.defaultProps = {
  error: '',
  type: 'text',
  validate: null,
  validateOnBlur: false,
  validateOnChange: false,
};

export default InputField;
