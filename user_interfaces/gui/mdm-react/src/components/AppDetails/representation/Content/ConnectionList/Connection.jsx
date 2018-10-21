import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const Connection = ({ connection }) => (
  <div>
    <div>
      {'Source: '}
      {_.get(connection, 'service_from')}
    </div>
    <div>
      {'Target: '}
      {_.get(connection, 'service_to')}
    </div>
    <div>
      {'Port: '}
      {_.get(connection, 'port')}
    </div>
  </div>
);

Connection.propTypes = {
  connection: PropTypes.shape().isRequired,
};
Connection.defaultProps = {};

export default Connection;
