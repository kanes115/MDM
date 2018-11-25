import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { openMetricsPanel } from '../../../../actions';

class MetricsButtons extends Component {
  render() {
    const { deployed, openPanel } = this.props;

    return deployed && (
      <ul>
        <li
          onClick={openPanel}
        >
          <i className="material-icons">data_usage</i>
          {' '}
          {'Live metrics'}
        </li>
        <li
          onClick={() => window.open('https://mdm-persistent-metrics.com')}
        >
          <i className="material-icons">bar_chart</i>
          {' '}
          {'All metrics'}
        </li>
      </ul>
    );
  }
}

MetricsButtons.propTypes = {
  deployed: PropTypes.bool.isRequired,
  openPanel: PropTypes.func.isRequired,
};
MetricsButtons.defaultProps = {};

function mapStateToProps({
  graph: {
    deployment: {
      deployed,
    },
  },
}) {
  return {
    deployed,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    openPanel: () => dispatch(openMetricsPanel()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MetricsButtons);
