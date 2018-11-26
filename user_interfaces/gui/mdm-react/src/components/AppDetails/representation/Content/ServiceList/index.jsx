import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ServiceListElement from './ServiceListElement';

class ServiceList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: {},
    };
  }

  toggleMachineExpanded = (id) => {
    this.setState(prevState => ({
      expanded: {
        ...prevState.expanded,
        [id]: !prevState.expanded[id],
      },
    }));
  };

  render() {
    const { canModify, services, onDeleteClick, onEditClick } = this.props;
    const { expanded } = this.state;

    return services.length > 0 && (
      <div>
        <h3>
          {'Services'}
        </h3>
        <ul className="element-list">
          {services.map(service => (
            <ServiceListElement
              key={service.name}
              canModify={canModify}
              isExpanded={expanded[service.name]}
              onDeleteClick={() => onDeleteClick('service', service)}
              onEditClick={() => onEditClick('service', service)}
              service={service}
              toggleMachineExpanded={this.toggleMachineExpanded}
            />
          ))}
        </ul>
      </div>
    );
  }
}

ServiceList.propTypes = {
  canModify: PropTypes.bool.isRequired,
  services: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
};
ServiceList.defaultProps = {};

export default ServiceList;
