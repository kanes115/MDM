import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import MachineList from './MachineList/index';

class AppDetailsContent extends Component {
  render() {
    const { activeSystem } = this.props;

    console.log(activeSystem)
    return (
      <div>
        <MachineList
          machines={_.get(activeSystem, 'machines', [])}
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
  }).isRequired,
};
AppDetailsContent.defaultProps = {};

export default AppDetailsContent;
