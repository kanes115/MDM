import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
  deleteMachine,
  deleteService,
  deleteConnection,
  openForm,
} from '../../actions';

import AppDetails from './representation';

class AppDetailsContainer extends Component {
  render() {
    const {
      activeSystem,
      canModify,
      deploymentError,
      errorOccurred,
      isModelEmpty,
      onDeleteClick,
      onEditClick,
    } = this.props;

    return (
      <AppDetails
        activeSystem={activeSystem}
        canModify={canModify}
        deploymentError={deploymentError}
        errorOccurred={errorOccurred}
        isModelEmpty={isModelEmpty}
        onDeleteClick={onDeleteClick}
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
  canModify: PropTypes.bool.isRequired,
  deploymentError: PropTypes.shape(),
  errorOccurred: PropTypes.bool,
  isModelEmpty: PropTypes.bool.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
};
AppDetailsContainer.defaultProps = {
  activeSystem: null,
  deploymentError: null,
  errorOccurred: false,
};

function mapStateToProps({
  graph: {
    deployment: {
      dataGathered,
      deployed,
      deploying,
      gatheringData,
      error,
    },
  },
  jmmsr: { activeSystemId, systems },
}) {
  const activeSystem = systems[activeSystemId];
  const isModelEmpty = _.get(activeSystem, 'connections.length', 0) === 0
    && _.get(activeSystem, 'machines.length', 0) === 0
    && _.get(activeSystem, 'services.length', 0) === 0;
  const errorOccurred = !!error;
  const canModify = !dataGathered && !deployed && !deploying && !gatheringData;

  return {
    activeSystem,
    canModify,
    deploymentError: error,
    errorOccurred,
    isModelEmpty,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDeleteClick: (type, object) => {
      switch (type) {
        case 'machine':
          return dispatch(deleteMachine(object));
        case 'service':
          return dispatch(deleteService(object));
        case 'connection':
          return dispatch(deleteConnection(object));
        default:
          return null;
      }
    },
    onEditClick: (type, object) => dispatch(openForm(type, object)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppDetailsContainer);
