import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { closeStoppedSystemInfo } from '../actions';

import { EmptyState } from '../components';

class StoppedSystemInfo extends Component {
  render() {
    const { close, liveMetrics } = this.props;

    return (
      <div className="overlay">
        <div className="loader">
          <EmptyState iconName="assignment">
            {'Service exit statuses'}
            <ul className="summary">
              {liveMetrics.map(metrics => (
                <li
                  className="summary-item"
                  key={metrics.service_name}
                >
                  <div className="key">{metrics.service_name}</div>
                  <div className="value">
                    {'status code '}
                    {metrics.status}
                  </div>
                </li>
              ))}
            </ul>
            <button
              className="action"
              onClick={close}
              type="button"
            >
              {'Close summary'}
            </button>
          </EmptyState>
        </div>
      </div>
    );
  }
}

function mapStateToProps({
  jmmsr: {
    systems,
    activeSystemId,
  },
}) {
  const activeSystem = systems[activeSystemId];
  const liveMetrics = _.get(activeSystem, 'live_metrics.services', []);

  return {
    liveMetrics,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    close: () => dispatch(closeStoppedSystemInfo()),
  };
}

StoppedSystemInfo.propTypes = {
  close: PropTypes.func.isRequired,
  liveMetrics: PropTypes.arrayOf(PropTypes.object),
};
StoppedSystemInfo.defaultProps = {
  liveMetrics: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(StoppedSystemInfo);
