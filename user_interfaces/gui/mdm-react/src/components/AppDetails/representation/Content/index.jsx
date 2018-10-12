import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import MachineList from './MachineList/index';

class AppDetailsContent extends Component {
  render() {
    const { activeSystem, onEditClick } = this.props;

    return (
      <div>
        <MachineList
          machines={_.get(activeSystem, 'machines', [])}
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
