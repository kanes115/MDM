import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ElementField from '../ElementField';

const Connection = ({ connection }) => (
  <div className="element-details">
    <ElementField
      label="Source:"
      value={_.get(connection, 'service_from')}
    />
    <ElementField
      label="Target:"
      value={_.get(connection, 'service_to')}
    />
    <ElementField
      label="Port:"
      value={_.get(connection, 'port')}
    />
  </div>
);

Connection.propTypes = {
  connection: PropTypes.shape().isRequired,
};
Connection.defaultProps = {};

export default Connection;
