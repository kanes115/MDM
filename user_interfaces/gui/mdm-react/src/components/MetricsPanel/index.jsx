import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { closeMetricsPanel } from '../../actions';

import MetricsPanel from './representation/index';

class MetricsPanelWrapper extends Component {
  render() {
    const {
      closePanel,
      metrics,
      panelOpen,
    } = this.props;

    return (
      <MetricsPanel
        closePanel={closePanel}
        metrics={metrics}
        panelOpen={panelOpen}
      />
    );
  }
}

MetricsPanelWrapper.propTypes = {
  closePanel: PropTypes.func.isRequired,
  metrics: PropTypes.shape(),
  panelOpen: PropTypes.bool.isRequired,
};
MetricsPanelWrapper.defaultProps = {
  metrics: {},
};

function mapStateToProps({
  jmmsr: {
    activeSystemId,
    metricsPanel: {
      panelOpen,
    },
    systems,
  },
}) {
  const activeSystem = systems[activeSystemId];

  return {
    metrics: _.get(activeSystem, 'live_metrics'),
    panelOpen,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closePanel: () => dispatch(closeMetricsPanel()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MetricsPanelWrapper);
