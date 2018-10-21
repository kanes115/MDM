import React from 'react';
import PropTypes from 'prop-types';

import DetailsListElement from '../DetailsListElement';
import Connection from './Connection';

const ConnectionListElement = ({
  canModify,
  connection,
  isExpanded,
  onDeleteClick,
  onEditClick,
  toggleConnectionExpanded,
}) => (
  <DetailsListElement
    canModify={canModify}
    isExpanded={isExpanded}
    onDeleteClick={onDeleteClick}
    onEditClick={onEditClick}
    title={`${connection.service_from} -> ${connection.service_to}`}
    toggleExpanded={() => toggleConnectionExpanded(connection)}
  >
    <Connection connection={connection} />
  </DetailsListElement>
);

ConnectionListElement.propTypes = {
  canModify: PropTypes.bool.isRequired,
  connection: PropTypes.shape({}).isRequired,
  isExpanded: PropTypes.bool,
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  toggleConnectionExpanded: PropTypes.func.isRequired,
};
ConnectionListElement.defaultProps = {
  isExpanded: false,
};

export default ConnectionListElement;
