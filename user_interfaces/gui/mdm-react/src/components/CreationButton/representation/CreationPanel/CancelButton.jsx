import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { backToDeployment } from '../../../../actions/graph/deployment';

class CancelButton extends Component {
  render() {
    const { cancel, canGoBack } = this.props;

    return canGoBack && (
      <li onClick={cancel}>
        <i className="back material-icons">arrow_back_ios</i>
        {' '}
        {'Cancel'}
      </li>
    );
  }
}

CancelButton.propTypes = {
  cancel: PropTypes.func.isRequired,
  canGoBack: PropTypes.bool.isRequired,
};
CancelButton.defaultProps = {};

function mapStateToProps({
  graph: {
    deployment: {
      dataGathered,
      deploying,
      gatheringData,
    },
  },
}) {
  const canGoBack = gatheringData || dataGathered || deploying;

  return {
    canGoBack,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cancel: () => dispatch(backToDeployment()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CancelButton);
