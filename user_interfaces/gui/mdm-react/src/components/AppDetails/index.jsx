import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { openForm } from '../../actions';

import AppDetails from './representation';

class AppDetailsContainer extends Component {
  render() {
    const {
      activeSystem,
      deploymentError,
      errorOccurred,
      isModelEmpty,
      onEditClick,
    } = this.props;

    return (
      <AppDetails
        activeSystem={activeSystem}
        deploymentError={deploymentError}
        errorOccurred={errorOccurred}
        isModelEmpty={isModelEmpty}
        onEditClick={onEditClick}
      />
    );
  }
}

AppDetailsContainer.propTypes = {
  activeSystem: PropTypes.shape({
    config: PropTypes.object,
    connections: PropTypes.array,
    machines: PropTypes.array,
    services: PropTypes.array,
  }),
  deploymentError: PropTypes.shape(),
  errorOccurred: PropTypes.bool,
  isModelEmpty: PropTypes.bool.isRequired,
  onEditClick: PropTypes.func.isRequired,
};
AppDetailsContainer.defaultProps = {
  activeSystem: null,
  deploymentError: null,
  errorOccurred: false,
};

function mapStateToProps({
  graph: { deployment: { error } },
  jmmsr: { activeSystemId, systems },
}) {
  const activeSystem = systems[activeSystemId];
  const isModelEmpty = _.get(activeSystem, 'connections.length', 0) === 0
    && _.get(activeSystem, 'machines.length', 0) === 0
    && _.get(activeSystem, 'services.length', 0) === 0;
  const errorOccurred = !!error;

  return {
    activeSystem,
    deploymentError: error,
    errorOccurred,
    isModelEmpty,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onEditClick: (type, object) => dispatch(openForm(type, object)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppDetailsContainer);
