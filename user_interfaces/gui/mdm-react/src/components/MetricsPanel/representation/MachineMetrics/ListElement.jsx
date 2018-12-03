import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import MetricsListElement from '../MetricsListElement';
import SingleMachineMetrics from '../Metrics';

const MachineMetricsListElement = ({ isExpanded, metrics, toggleMachineExpanded }) => (
  <MetricsListElement
    isExpanded={isExpanded}
    title={_.get(metrics, 'machine_name')}
    toggleExpanded={() => toggleMachineExpanded(_.get(metrics, 'machine_name'))}
    warning={_.get(metrics, 'is_down', false)}
  >
    <SingleMachineMetrics metrics={metrics} />
  </MetricsListElement>
);


MachineMetricsListElement.propTypes = {
  isExpanded: PropTypes.bool,
  metrics: PropTypes.shape({}).isRequired,
  toggleMachineExpanded: PropTypes.func.isRequired,
};
MachineMetricsListElement.defaultProps = {
  isExpanded: false,
};

export default MachineMetricsListElement;
