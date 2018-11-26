import React from 'react';
import PropTypes from 'prop-types';

import DetailsListElement from '../DetailsListElement';
import Service from './Service';

const ServiceListElement = ({
  canModify,
  isExpanded,
  machineIdToNameMap,
  onDeleteClick,
  onEditClick,
  service,
  toggleMachineExpanded,
}) => (
  <DetailsListElement
    canModify={canModify}
    isExpanded={isExpanded}
    onDeleteClick={onDeleteClick}
    onEditClick={onEditClick}
    title={service.name}
    toggleExpanded={() => toggleMachineExpanded(service.name)}
  >
    <Service
      machineIdToNameMap={machineIdToNameMap}
      service={service}
    />
  </DetailsListElement>
);

ServiceListElement.propTypes = {
  canModify: PropTypes.bool.isRequired,
  isExpanded: PropTypes.bool,
  machineIdToNameMap: PropTypes.shape({}),
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  service: PropTypes.shape({}).isRequired,
  toggleMachineExpanded: PropTypes.func.isRequired,
};
ServiceListElement.defaultProps = {
  isExpanded: false,
  machineIdToNameMap: {},
};

export default ServiceListElement;
