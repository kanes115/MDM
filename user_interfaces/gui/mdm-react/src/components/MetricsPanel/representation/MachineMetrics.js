import React from 'react';
import PropTypes from 'prop-types';

const MachineMetrics = ({ metrics, panelType }) => panelType === 'machine' && (
  <div>
    machine metrics
    {JSON.stringify(metrics)}
  </div>
);

MachineMetrics.propTypes = {
  metrics: PropTypes.arrayOf(PropTypes.shape()),
  panelType: PropTypes.oneOf(['', 'machine', 'service', 'connection']).isRequired,
};
MachineMetrics.defaultProps = {
  metrics: [],
};

export default MachineMetrics;
