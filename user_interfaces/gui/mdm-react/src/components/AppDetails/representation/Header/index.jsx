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

  render() {
    const {
      isModelEmpty,
    } = this.props;

    return (
      <div>
        {isModelEmpty
          ? (
            <h1>
              {'No system active'}
            </h1>
          )
          : (
            <h1>
              {this.getViewPath()}
            </h1>
          )
        }
      </div>
    );
  }
}

AppDetailsHeader.propTypes = {
  activeSystemName: PropTypes.string.isRequired,
  currentView: PropTypes.arrayOf(PropTypes.string).isRequired,
  isModelEmpty: PropTypes.bool.isRequired,
};
AppDetailsHeader.defaultProps = {};

function mapStateToProps({
  graph: { view: { currentView } },
  jmmsr: { activeSystemId, systems },
}) {
  const activeSystemName = _.get(systems, `${activeSystemId}.name`);
  const isModelEmpty = _.get(systems, `${activeSystemId}.connections.length`, 0) === 0 &&
    _.get(systems, `${activeSystemId}.machines.length`, 0) === 0 &&
    _.get(systems, `${activeSystemId}.services.length`, 0) === 0;

  return {
    activeSystemName,
    currentView,
    isModelEmpty,
  };
}

export default connect(mapStateToProps)(AppDetailsHeader);
