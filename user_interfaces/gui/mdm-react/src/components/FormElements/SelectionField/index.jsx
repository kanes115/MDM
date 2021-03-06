import React from 'react';
import PropTypes from 'prop-types';
import { Option, Select } from 'informed';

import './selection-field.css';

const SelectionField = ({
  id,
  field,
  label,
  multiple,
  options,
}) => (
  <div className="mdm-form-selection-field">
    <label htmlFor={id}>{label}</label>
    <Select
      field={field}
      id={id}
      multiple={multiple}
    >
      {multiple
        ? (
          <Option
            disabled
            value=""
          >
                        Select one or more
          </Option>
        )
        : (
          <Option
            disabled
            value=""
          >
                        Select one
          </Option>
        )}
      {options.map(({ optionLabel, optionValue }) => (
        <Option
          value={optionValue}
          key={`${id}_${optionValue}`}
        >
          {optionLabel}
        </Option>
      ))}
    </Select>
  </div>
);

SelectionField.propTypes = {
  id: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      optionLabel: PropTypes.string,
      optionValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }),
  ).isRequired,
};
SelectionField.defaultProps = {
  multiple: false,
};

export default SelectionField;
