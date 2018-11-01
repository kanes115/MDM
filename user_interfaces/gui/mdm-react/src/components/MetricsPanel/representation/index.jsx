import React from 'react';
import PropTypes from 'prop-types';

import { CloseIcon } from '../..';
import TypeChooser from './TypeChooser';

import MachineMetrics from './MachineMetrics';

import './metrics-panel.css';

const MetricsPanel = ({
  closePanel,
  metrics,
  panelOpen,
  panelType,
  selectMetricsType,
}) => panelOpen && (
  <div className="mdm-metrics-panel">
    <CloseIcon onClose={closePanel} />
    <TypeChooser selectMetricsType={selectMetricsType} />
    {panelType}
    <MachineMetrics
      metrics={metrics.machines}
      panelType={panelType}
    />
  </div>
);

MetricsPanel.propTypes = {
  closePanel: PropTypes.func.isRequired,
  metrics: PropTypes.shape(),
  panelOpen: PropTypes.bool.isRequired,
  panelType: PropTypes.oneOf(['', 'machine', 'service', 'connection']).isRequired,
  selectMetricsType: PropTypes.func.isRequired,
};
MetricsPanel.defaultProps = {
  metrics: {},
};

export default MetricsPanel;
