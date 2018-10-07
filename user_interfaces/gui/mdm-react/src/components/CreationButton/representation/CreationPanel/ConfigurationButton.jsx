import React from 'react';
import PropTypes from 'prop-types';

const ConfigurationButton = ({
  isSystemActive,
  modelling,
  handleSystemConfiguration,
  handleSystemCreation,
}) => (
  isSystemActive
    ? modelling && (
      <li onClick={handleSystemConfiguration}>
        <i className="material-icons">build</i>
        {' '}
        {'Configure system'}
      </li>
    )
    : (
      <li onClick={handleSystemCreation}>
        <i className="material-icons">device_hub</i>
        {' '}
        {'Add system'}
      </li>
    )
);

ConfigurationButton.propTypes = {
  handleSystemConfiguration: PropTypes.func.isRequired,
  handleSystemCreation: PropTypes.func.isRequired,
  isSystemActive: PropTypes.bool.isRequired,
  modelling: PropTypes.bool.isRequired,
};
ConfigurationButton.defaultProps = {};

export default ConfigurationButton;
