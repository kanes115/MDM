import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { stopSystem } from '../../../../providers/websocket';

class StopButton extends Component {
  render() {
    const { deployed } = this.props;

    return deployed && (
      <li onClick={stopSystem}>
        <i className="material-icons">cancel</i>
        {' '}
        {'Stop system'}
      </li>
    );
  }
}

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

StopButton.propTypes = {
  deployed: PropTypes.bool.isRequired,
};
StopButton.defaultProps = {};

export default connect(mapStateToProps, null)(StopButton);
