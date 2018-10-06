import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

class AppDetailsHeader extends Component {
  getViewPath = () => {
    const { activeSystemName, currentView } = this.props;
    let name = activeSystemName;
    let type = 'System';
    if (currentView.length === 1) {
      name = currentView[0];
      type = 'Machine';
    }
    if (currentView.length >= 2) {
      name = currentView[1];
      type = 'Service';
    }


    return `${type} ${name}`;
  };

  // isModelling = () => {
  //   const {
  //     deployment: {
  //       dataGathered,
  //       deployed,
  //       deploying,
  //       gatheringData,
  //     },
  //   } = this.props;
  //
  //   return !(
  //     dataGathered
  //       || deployed
  //       || deploying
  //       || gatheringData
  //   )
  // };

  render() {
    const {
      deployment: {
        dataGathered,
        deployed,
        deploying,
        gatheringData,
      },
      isSystemActive,
    } = this.props;

    return (
      <div>
        {isSystemActive
          ? (
            <h2>
              {this.getViewPath()}
            </h2>
          )
          : (
            <h2>
              {'No system active'}
            </h2>
          )
        }
      </div>
    );
  }
}

AppDetailsHeader.propTypes = {
  activeSystemName: PropTypes.string.isRequired,
  currentView: PropTypes.arrayOf(PropTypes.string).isRequired,
  deployment: PropTypes.shape({
    dataGathered: PropTypes.bool,
    deployed: PropTypes.bool,
    deploying: PropTypes.bool,
    gatheringData: PropTypes.bool,
  }).isRequired,
  isSystemActive: PropTypes.bool.isRequired,
};
AppDetailsHeader.defaultProps = {};

function mapStateToProps({
  graph: { deployment, view: { currentView } },
  jmmsr: { activeSystemId, systems },
}) {
  const activeSystemName = _.get(systems, `${activeSystemId}.name`);
  const isSystemActive = !!activeSystemId;

  return {
    activeSystemName,
    currentView,
    deployment,
    isSystemActive,
  };
}

export default connect(mapStateToProps)(AppDetailsHeader);
