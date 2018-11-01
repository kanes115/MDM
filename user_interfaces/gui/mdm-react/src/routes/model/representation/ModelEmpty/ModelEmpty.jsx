import React from 'react';
import PropTypes from 'prop-types';
import DropZone from 'react-dropzone';
import c from 'classnames';

import { EmptyState } from '../../../../components/index';

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
      {(loading || validating || error || validationError) && (
        <div className="loader-progress-wrapper">
          <span
            className={c(
              'loader-progress-status',
              {
                error: progress === 1 && (error || validationError),
                complete: progress === 1 && !error && !validationError,
              },
            )}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}
      {validating && (
        <div>
          Validating...
        </div>
      )}
      <div className="loader-error">
        {error && (
          JSON.stringify(error)
        )}
        {validationError && (
          JSON.stringify(validationError)
        )}
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
