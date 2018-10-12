import React from 'react';
import PropTypes from 'prop-types';

import DetailsListElement from '../DetailsListElement';
import Service from './Service';

const ServiceListElement = ({
  canModify,
  isExpanded,
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
    <Service service={service} />
  </DetailsListElement>
);

ServiceListElement.propTypes = {
  canModify: PropTypes.bool.isRequired,
  isExpanded: PropTypes.bool,
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  service: PropTypes.shape({}).isRequired,
  toggleMachineExpanded: PropTypes.func.isRequired,
};
ServiceListElement.defaultProps = {
  isExpanded: false,
};

export default ServiceListElement;
