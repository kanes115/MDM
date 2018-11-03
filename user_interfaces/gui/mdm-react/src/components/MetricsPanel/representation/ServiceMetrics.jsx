import React from 'react';
import PropTypes from 'prop-types';

const ServiceMetrics = ({ metrics, panelType }) => panelType === 'service' && (
  <div>
    service metrics
    {JSON.stringify(metrics)}
  </div>
);

ServiceMetrics.propTypes = {
  metrics: PropTypes.arrayOf(PropTypes.shape()),
  panelType: PropTypes.oneOf(['', 'machine', 'service', 'connection']).isRequired,
};
ServiceMetrics.defaultProps = {
  metrics: [],
};

export default ServiceMetrics;
