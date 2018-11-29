import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { clearModel } from '../../../../actions';

class StopButton extends Component {
  render() {
    const { activeSystemId, canClear, clear, isSystemActive } = this.props;

    return canClear && isSystemActive && (
      <li onClick={() => clear(activeSystemId)}>
        <i className="material-icons">delete</i>
        {' '}
        {'Clear model'}
      </li>
    );
  }
}

function mapStateToProps({
  jmmsr: { activeSystemId },
  graph: {
    deployment: {
      dataGathered,
      deployed,
      deploying,
      gatheringData,
    },
  },
}) {
  const canClear = !dataGathered && !deployed && !deploying && !gatheringData;

  return {
    activeSystemId,
    canClear,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clear: systemName => dispatch(clearModel(systemName)),
  };
}

StopButton.propTypes = {
  activeSystemId: PropTypes.string,
  canClear: PropTypes.bool.isRequired,
  clear: PropTypes.func.isRequired,
  isSystemActive: PropTypes.bool.isRequired,
};
StopButton.defaultProps = {
  activeSystemId: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(StopButton);
