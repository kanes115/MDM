import React from 'react';
import PropTypes from 'prop-types';

const AppDetailsError = ({ deploymentError, errorOccurred }) => errorOccurred && (
  <div>
    <h3>An error occurred</h3>
    <span>At path </span>
    <span>{deploymentError.body.path}</span>
    <br />
    <span>Reason </span>
    <span>{deploymentError.body.reason}</span>
  </div>
);

AppDetailsError.propTypes = {
  deploymentError: PropTypes.shape(),
  errorOccurred: PropTypes.bool,
};
AppDetailsError.defaultProps = {
  deploymentError: null,
  errorOccurred: false,
};

export default AppDetailsError;
