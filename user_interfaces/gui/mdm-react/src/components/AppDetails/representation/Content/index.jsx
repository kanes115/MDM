import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ConnectionList from './ConnectionList';
import MachineList from './MachineList';
import ServiceList from './ServiceList';

class AppDetailsContent extends Component {
  render() {
    const { activeSystem, onEditClick } = this.props;

    return (
      <div>
        <MachineList
          machines={_.get(activeSystem, 'machines', [])}
          onEditClick={onEditClick}
        />
        <ServiceList
          services={_.get(activeSystem, 'services', [])}
          onEditClick={onEditClick}
        />
        <ConnectionList
          connections={_.get(activeSystem, 'connections', [])}
          onEditClick={onEditClick}
        />
      </div>
    );
  }
}

AppDetailsContent.propTypes = {
  activeSystem: PropTypes.shape({
    config: PropTypes.object,
    connections: PropTypes.array,
    machines: PropTypes.array,
    services: PropTypes.array,
  }),
  onEditClick: PropTypes.func.isRequired,
};
AppDetailsContent.defaultProps = {
  activeSystem: null,
};

export default AppDetailsContent;
