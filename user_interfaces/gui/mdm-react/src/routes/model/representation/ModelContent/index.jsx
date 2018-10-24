import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ModelEmpty from '../ModelEmpty';
import ModelGraph from '../ModelGraph';
import ModelHeader from '../ModelHeader';
import { initializeLoadedSystem } from '../../../../actions';

class ModelContent extends Component {
  componentDidUpdate(prevProps) {
    const { valid: previouslyValid } = prevProps;
    const { valid: nowValid, file, initializeSystem } = this.props;

    if (!previouslyValid && nowValid) {
      initializeSystem(file);
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
    file,
    isModelEmpty,
    valid,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initializeSystem: file => dispatch(initializeLoadedSystem(file)),
  };
}

ModelContent.propTypes = {
  file: PropTypes.shape({}),
  initializeSystem: PropTypes.func.isRequired,
  isModelEmpty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
};
ModelContent.defaultProps = {
  file: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModelContent);
