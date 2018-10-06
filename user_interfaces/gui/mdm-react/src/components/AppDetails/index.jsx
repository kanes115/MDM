import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AppDetails from './representation/index';

class AppDetailsContainer extends Component {
  render() {
    const { isModelEmpty } = this.props;

    return (
      <AppDetails
        isModelEmpty={isModelEmpty}
      />
    )
  }
}

AppDetailsContainer.propTypes = {
  isModelEmpty: PropTypes.bool.isRequired,
};
AppDetailsContainer.defaultProps = {};

function mapStateToProps({
  graph: { view: { currentView } },
  jmmsr: { activeSystemId, systems },
}) {
  const isModelEmpty = _.get(systems, `${activeSystemId}.connections.length`, 0) === 0 &&
    _.get(systems, `${activeSystemId}.machines.length`, 0) === 0 &&
    _.get(systems, `${activeSystemId}.services.length`, 0) === 0;

  return {
    isModelEmpty,
  };
}

export default connect()(AppDetailsContainer);
