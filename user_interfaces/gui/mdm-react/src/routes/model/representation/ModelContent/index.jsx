import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ModelEmpty from '../ModelEmpty';
import ModelGraph from '../ModelGraph';
import ModelHeader from '../ModelHeader';
import { initializeLoadedSystem, reorganizeMachines } from '../../../../actions';

class ModelContent extends Component {
  componentDidUpdate(prevProps) {
    const { deployed: previouslyDeployed, valid: previouslyValid } = prevProps;
    const {
      activeSystem,
      deployed: nowDeployed,
      valid: nowValid,
      file,
      initializeSystem,
      mapServicesToMachines,
    } = this.props;

    if (!previouslyValid && nowValid) {
      initializeSystem(file);
    }

    if (!previouslyDeployed && nowDeployed) {
      mapServicesToMachines(activeSystem);
    }
  }

  render() {
    const { isModelEmpty } = this.props;

    return (
      isModelEmpty
        ? (
          <ModelEmpty />
        )
        : (
          <div>
            <ModelHeader />
            <ModelGraph />
          </div>
        )
    );
  }
}

function mapStateToProps(state) {
  const {
    graph: {
      deployment: {
        deployed,
      },
    },
    jmmsr: {
      activeSystemId,
      fileLoader: {
        file,
        valid,
      },
      systems,
    },
  } = state;
  const activeSystem = systems[activeSystemId];
  const isModelEmpty = activeSystem.connections.length === 0
    && activeSystem.machines.length === 0
    && activeSystem.services.length === 0;

  return {
    activeSystem,
    deployed,
    file,
    isModelEmpty,
    valid,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initializeSystem: file => dispatch(initializeLoadedSystem(file)),
    mapServicesToMachines: system => dispatch(reorganizeMachines(system)),
  };
}

ModelContent.propTypes = {
  activeSystem: PropTypes.shape({}),
  deployed: PropTypes.bool.isRequired,
  file: PropTypes.shape({}),
  initializeSystem: PropTypes.func.isRequired,
  isModelEmpty: PropTypes.bool.isRequired,
  mapServicesToMachines: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
};
ModelContent.defaultProps = {
  activeSystem: null,
  file: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModelContent);
