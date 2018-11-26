import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { openMetricsPanel } from '../../../../actions';

class MetricsButtons extends Component {
  render() {
    const { dashboardLink, deployed, openPanel } = this.props;

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
          onClick={() => window.open(dashboardLink)}
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
  dashboardLink: PropTypes.string,
  deployed: PropTypes.bool.isRequired,
  openPanel: PropTypes.func.isRequired,
};
MetricsButtons.defaultProps = {
  dashboardLink: null,
};

function mapStateToProps({
  graph: {
    deployment: {
      dashboardLink,
      deployed,
    },
  },
}) {
  return {
    dashboardLink,
    deployed,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    openPanel: () => dispatch(openMetricsPanel()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MetricsButtons);
