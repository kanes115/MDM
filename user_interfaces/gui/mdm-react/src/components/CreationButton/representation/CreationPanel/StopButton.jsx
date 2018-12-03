import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { stopSystem } from '../../../../providers/websocket';

import { initSystemStop } from '../../../../actions/graph/deployment';

function stop(initializeSystemStop) {
  return () => {
    initializeSystemStop();
    stopSystem();
  };
}

class StopButton extends Component {
  render() {
    const { deployed, initializeSystemStop, stopping } = this.props;

    return deployed && (
      stopping
        ? (
          <li>
            {'Stopping system...'}
          </li>
        )
        : (
          <li onClick={stop(initializeSystemStop)}>
            <i className="material-icons">cancel</i>
            {' '}
            {'Stop system'}
          </li>
        )
    );
  }
}

function mapStateToProps({
  graph: {
    deployment: {
      deployed,
      stopping,
    },
  },
}) {
  return {
    deployed,
    stopping,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initializeSystemStop: () => dispatch(initSystemStop()),
  };
}

StopButton.propTypes = {
  deployed: PropTypes.bool.isRequired,
  initializeSystemStop: PropTypes.func.isRequired,
  stopping: PropTypes.bool.isRequired,
};
StopButton.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(StopButton);
