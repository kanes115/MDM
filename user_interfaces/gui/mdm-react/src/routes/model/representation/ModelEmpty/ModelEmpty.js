import React from 'react';
import PropTypes from 'prop-types';
import DropZone from 'react-dropzone';

import { EmptyState } from '../../../../components';

const ModelEmpty = ({
  error,
  loading,
  onDrop,
  progress,
}) => (
  <EmptyState iconName="category">
    <DropZone
      accept="application/json"
      multiple={false}
      onDrop={onDrop}
    >
      <div>System model is empty</div>
      <div>
        Use the button in bottom right corner to add elements
      </div>
      <div>
        Drop jmmsr file to load modelled system
      </div>
      <div>
        Error: {error}
      </div>
      <div>
        Loading: {`${loading}`}
      </div>
      <div>
        Progress: {progress}
      </div>
    </DropZone>
  </EmptyState>
);

ModelEmpty.propTypes = {
  error: PropTypes.shape({}),
  loading: PropTypes.bool.isRequired,
  onDrop: PropTypes.func.isRequired,
  progress: PropTypes.number.isRequired,
};
ModelEmpty.defaultProps = {
  error: null,
};

export default ModelEmpty;
