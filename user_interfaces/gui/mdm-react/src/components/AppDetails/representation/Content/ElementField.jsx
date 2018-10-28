import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';

const ElementField = ({
  hide,
  nested,
  label,
  value,
}) => (
  !hide && (
    <div
      className={c(
        'element-field',
        {
          nested,
        },
      )}
    >
      <span className="key">
        {label}
      </span>
      <span className="value">
        {value}
      </span>
    </div>
  ));

ElementField.propTypes = {
  hide: PropTypes.bool,
  label: PropTypes.string.isRequired,
  nested: PropTypes.bool,
  value: PropTypes.string,
};
ElementField.defaultProps = {
  hide: false,
  nested: false,
  value: '',
};

export default ElementField;
