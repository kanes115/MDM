import React from 'react';
import PropTypes from 'prop-types';

import DetailsListElement from '../DetailsListElement';
import Machine from './Machine';

const MachineListElement = ({
  canModify,
  isExpanded,
  machine,
  onDeleteClick,
  onEditClick,
  toggleMachineExpanded,
}) => (
  <DetailsListElement
    canModify={canModify}
    isExpanded={isExpanded}
    onDeleteClick={onDeleteClick}
    onEditClick={onEditClick}
    title={machine.name}
    toggleExpanded={() => toggleMachineExpanded(machine.id)}
  >
    <Machine machine={machine} />
  </DetailsListElement>
);

MachineListElement.propTypes = {
  canModify: PropTypes.bool.isRequired,
  isExpanded: PropTypes.bool,
  machine: PropTypes.shape({}).isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  toggleMachineExpanded: PropTypes.func.isRequired,
};
MachineListElement.defaultProps = {
  isExpanded: false,
};

export default MachineListElement;
