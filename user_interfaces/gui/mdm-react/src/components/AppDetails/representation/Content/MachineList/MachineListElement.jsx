import React from 'react';
import PropTypes from 'prop-types';

import DetailsListElement from '../DetailsListElement';
import Machine from './Machine';

const MachineListElement = ({ isExpanded, machine, toggleMachineExpanded }) => (
  <DetailsListElement
    isExpanded={isExpanded}
    title={machine.name}
    toggleExpanded={() => toggleMachineExpanded(machine.id)}
  >
    <Machine machine={machine} />
  </DetailsListElement>
);

MachineListElement.propTypes = {
  isExpanded: PropTypes.bool,
  machine: PropTypes.shape({}).isRequired,
  toggleMachineExpanded: PropTypes.func.isRequired,
};
MachineListElement.defaultProps = {
  isExpanded: false,
};

export default MachineListElement;
