import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import c from 'classnames';

class DeploymentButton extends Component {
  render() {
    const {
      dataGathered,
      deploying,
      gatheringData,
      isSystemActive,
      handleSystemDataCollection,
      handleSystemDeployment,
    } = this.props;

    return (
      isSystemActive && (
        dataGathered
          ? (deploying
            ? (
              <li>Deploying...</li>
            )
            : (
              <li
                className={c({disabled: gatheringData})}
                onClick={handleSystemDeployment}
              >
                <i className="material-icons">publish</i>
                {' '}
                {'Deploy system'}
              </li>
            )
          )
          : (gatheringData
            ? (
              <li>Gathering data...</li>
            )
            : (
              <li onClick={handleSystemDataCollection}>
                <i className="material-icons">data_usage</i>
                {' '}
                {'Collect Data'}
              </li>
            )
          )
      )
    );
  }
}

DeploymentButton.propTypes = {
  dataGathered: PropTypes.bool.isRequired,
  deploying: PropTypes.bool.isRequired,
  gatheringData: PropTypes.bool.isRequired,
  isSystemActive: PropTypes.bool.isRequired,
  handleSystemDataCollection: PropTypes.func.isRequired,
  handleSystemDeployment: PropTypes.func.isRequired,
};
DeploymentButton.defaultProps = {};

function mapStateToProps({
  graph: {
    deployment: {
      dataGathered,
      deploying,
      gatheringData,
    },
  },
}) {
  return {
    dataGathered,
    deploying,
    gatheringData,
  };
}

export default connect(mapStateToProps)(DeploymentButton);
