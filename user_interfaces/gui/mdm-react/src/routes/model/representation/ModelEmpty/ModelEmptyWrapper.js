import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  initializeLoadedSystem,
  startFileProcessing,
  fileProcessingProgress,
  fileProcessingSuccess,
  fileProcessingError,
} from '../../../../actions';

import ModelEmpty from './ModelEmpty';

class ModelEmptyWrapper extends Component {
  constructor(props) {
    super(props);
    const {
      onProcessingProgress,
      onProcessingSuccess,
      onProcessingError,
    } = props;

    this.fileReader = new FileReader();
    this.fileReader.onprogress = onProcessingProgress;
    this.fileReader.onload = onProcessingSuccess;
    this.fileReader.onerror = onProcessingError;
  }

  onDrop = (files) => {
    const { onProcessingStart } = this.props;

    const file = files[0];
    onProcessingStart();
    this.fileReader.readAsText(file);

  };

  render() {
    const {
      error,
      loading,
      loadModel,
      progress,
      valid,
      validating,
      validationError,
    } = this.props;

    return (
      <ModelEmpty
        error={error}
        loading={loading}
        loadModel={loadModel}
        onDrop={this.onDrop}
        progress={progress}
        valid={valid}
        validating={validating}
        validationError={validationError}
      />
    );
  }
}

ModelEmptyWrapper.propTypes = {
  error: PropTypes.shape({}),
  file: PropTypes.shape({}),
  initializeSystem: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  onProcessingStart: PropTypes.func.isRequired,
  onProcessingProgress: PropTypes.func.isRequired,
  onProcessingSuccess: PropTypes.func.isRequired,
  onProcessingError: PropTypes.func.isRequired,
  progress: PropTypes.number.isRequired,
  valid: PropTypes.bool.isRequired,
  validating: PropTypes.bool.isRequired,
  validationError: PropTypes.shape(),
};
ModelEmptyWrapper.defaultProps = {
  error: null,
  file: null,
  validationError: null,
};

function mapStateToProps({
  jmmsr: {
    fileLoader: {
      error,
      file,
      loading,
      progress,
      valid,
      validating,
      validationError,
    },
  },
}) {
  return {
    error,
    file,
    loading,
    progress,
    valid,
    validating,
    validationError,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initializeSystem: file => dispatch(initializeLoadedSystem(file)),
    onProcessingStart: file => dispatch(startFileProcessing(file)),
    onProcessingProgress: event => dispatch(fileProcessingProgress(event)),
    onProcessingSuccess: event => dispatch(fileProcessingSuccess(event)),
    onProcessingError: event => dispatch(fileProcessingError(event)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelEmptyWrapper);
