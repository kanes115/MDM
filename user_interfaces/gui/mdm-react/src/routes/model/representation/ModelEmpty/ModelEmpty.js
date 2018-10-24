import React from 'react';
import PropTypes from 'prop-types';
import DropZone from 'react-dropzone';

import { EmptyState } from '../../../../components';

import './model-empty.css';

const ModelEmpty = ({
  error,
  loading,
  onDrop,
  progress,
  valid,
  validating,
  validationError,
}) => (
  <EmptyState iconName="category">
    <DropZone
      accept="application/json"
      className="mdm-drop-zone"
      multiple={false}
      onDrop={onDrop}
    >
      <div>System model is empty</div>
      <div>
        Use the <span className="action">button</span> in bottom right corner to add elements
      </div>
      <div>
        <span className="action">Drop</span> file to load modelled system
      </div>
      <div>
        Error: {`${error}`}
      </div>
      <div>
        Loading: {`${loading}`}
      </div>
      <div>
        Progress: {progress}
      </div>
      <div>
        Validating: {`${validating}`}
      </div>
      <div>
        Validation error: {`${JSON.stringify(validationError)}`}
      </div>
    </DropZone>
  </EmptyState>
);

ModelEmpty.propTypes = {
  error: PropTypes.shape({}),
  loading: PropTypes.bool.isRequired,
  onDrop: PropTypes.func.isRequired,
  progress: PropTypes.number.isRequired,
  valid: PropTypes.bool.isRequired,
  validating: PropTypes.bool.isRequired,
  validationError: PropTypes.shape(),
};
ModelEmpty.defaultProps = {
  error: null,
  validationError: null,
};

export default ModelEmpty;
