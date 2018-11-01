import React from 'react';
import PropTypes from 'prop-types';

const TypeChooser = ({ selectMetricsType }) => (
  <ul>
    <li onClick={() => selectMetricsType('machine')}>
      Machine
    </li>
    <li onClick={() => selectMetricsType('service')}>
      Service
    </li>
    <li onClick={() => selectMetricsType('connection')}>
      Connection
    </li>
  </ul>
);

TypeChooser.propTypes = {
  selectMetricsType: PropTypes.func.isRequired,
};
TypeChooser.defaultProps = {};

export default TypeChooser;
