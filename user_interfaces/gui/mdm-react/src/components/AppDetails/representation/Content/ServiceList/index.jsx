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
    const { services, onEditClick } = this.props;
    const { expanded } = this.state;

    return services.length > 0 && (
      <div>
        <h3>
          {'Services'}
        </h3>
        <ul>
          {services.map(service => (
            <ServiceListElement
              key={service.name}
              canModify={true}
              isExpanded={expanded[service.name]}
              onDeleteClick={() => console.log('delete', service.name)}
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
  services: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEditClick: PropTypes.func.isRequired,
};
ServiceList.defaultProps = {};

export default ServiceList;
