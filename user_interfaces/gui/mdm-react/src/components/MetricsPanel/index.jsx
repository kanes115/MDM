import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { closeMetricsPanel, changeMetricsPanelType } from '../../actions';

import MetricsPanel from './representation/index';

class MetricsPanelWrapper extends Component {
  render() {
    const {
      closePanel,
      metrics,
      panelOpen,
      panelType,
      selectMetricsType,
    } = this.props;

    return (
      <MetricsPanel
        closePanel={closePanel}
        metrics={metrics}
        panelOpen={panelOpen}
        panelType={panelType}
        selectMetricsType={selectMetricsType}
      />
    );
  }
}

MetricsPanelWrapper.propTypes = {
  closePanel: PropTypes.func.isRequired,
  metrics: PropTypes.shape(),
  panelOpen: PropTypes.bool.isRequired,
  panelType: PropTypes.oneOf(['', 'machine', 'service', 'connection']).isRequired,
  selectMetricsType: PropTypes.func.isRequired,
};
MetricsPanelWrapper.defaultProps = {
  metrics: {},
};

function mapStateToProps({
  jmmsr: {
    activeSystemId,
    metricsPanel: {
      panelOpen,
      panelType,
    },
    systems,
  },
}) {
  const activeSystem = systems[activeSystemId];

  return {
    metrics: _.get(activeSystem, 'live_metrics'),
    panelOpen,
    panelType,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closePanel: () => dispatch(closeMetricsPanel()),
    selectMetricsType: (metricsType) => dispatch(changeMetricsPanelType(metricsType)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MetricsPanelWrapper);
