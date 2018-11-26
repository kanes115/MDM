import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ConnectionList from './ConnectionList';
import MachineList from './MachineList';
import ServiceList from './ServiceList';

class AppDetailsContent extends Component {
  render() {
    const { activeSystem, canModify, onDeleteClick, onEditClick } = this.props;

    return (
      <div>
        <MachineList
          canModify={canModify}
          machines={_.get(activeSystem, 'machines', [])}
          onDeleteClick={onDeleteClick}
          onEditClick={onEditClick}
        />
        <ServiceList
          canModify={canModify}
          services={_.get(activeSystem, 'services', [])}
          onDeleteClick={onDeleteClick}
          onEditClick={onEditClick}
        />
        <ConnectionList
          canModify={canModify}
          connections={_.get(activeSystem, 'connections', [])}
          onDeleteClick={onDeleteClick}
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
  canModify: PropTypes.bool.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
};
AppDetailsContent.defaultProps = {
  activeSystem: null,
};

export default AppDetailsContent;
