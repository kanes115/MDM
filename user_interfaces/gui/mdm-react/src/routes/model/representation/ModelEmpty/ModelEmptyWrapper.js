import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
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
      progress,
    } = this.props;

    return (
      <ModelEmpty
        error={error}
        loading={loading}
        onDrop={this.onDrop}
        progress={progress}
      />
    );
  }
}

ModelEmptyWrapper.propTypes = {
  error: PropTypes.shape({}),
  loading: PropTypes.bool.isRequired,
  onProcessingStart: PropTypes.func.isRequired,
  onProcessingProgress: PropTypes.func.isRequired,
  onProcessingSuccess: PropTypes.func.isRequired,
  onProcessingError: PropTypes.func.isRequired,
  progress: PropTypes.number.isRequired,
};
ModelEmptyWrapper.defaultProps = {
  error: null,

};

function mapStateToProps({
  jmmsr: {
    fileLoader: {
      error,
      loading,
      progress,
    },
  },
}) {
  return {
    error,
    loading,
    progress,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onProcessingStart: file => dispatch(startFileProcessing(file)),
    onProcessingProgress: event => dispatch(fileProcessingProgress(event)),
    onProcessingSuccess: event => dispatch(fileProcessingSuccess(event)),
    onProcessingError: event => dispatch(fileProcessingError(event)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelEmptyWrapper);
