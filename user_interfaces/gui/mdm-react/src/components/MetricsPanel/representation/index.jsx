import React from 'react';
import PropTypes from 'prop-types';

import { CloseIcon } from '../..';

import MachineMetrics from './MachineMetrics';
import ServiceMetrics from './ServiceMetrics';

import './metrics-panel.css';

const MetricsPanel = ({
  closePanel,
  metrics,
  panelOpen,
}) => panelOpen && (
  <div className="mdm-metrics-panel">
    <CloseIcon onClose={closePanel} />
    <MachineMetrics
      metrics={metrics.machines}
    />
    <ServiceMetrics
      metrics={metrics.services}
    />
  </div>
);

MetricsPanel.propTypes = {
  closePanel: PropTypes.func.isRequired,
  metrics: PropTypes.shape(),
  panelOpen: PropTypes.bool.isRequired,
};
MetricsPanel.defaultProps = {
  metrics: {},
};

export default MetricsPanel;
