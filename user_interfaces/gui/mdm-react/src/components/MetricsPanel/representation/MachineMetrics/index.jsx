import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ListElement from './ListElement';

class MachineMetrics extends Component {
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
    const { metrics } = this.props;
    const { expanded } = this.state;

    return (
      <div className="mdm-metrics-list">
        <h3>
          {'Machine metrics'}
        </h3>
        <ul className="element-list">
          {metrics.map(machineMetrics => (
            <ListElement
              key={_.get(machineMetrics, 'machine_name')}
              isExpanded={expanded[_.get(machineMetrics, 'machine_name')]}
              metrics={machineMetrics}
              toggleMachineExpanded={this.toggleMachineExpanded}
            />
          ))}
        </ul>
      </div>
    )
  }
}

MachineMetrics.propTypes = {
  metrics: PropTypes.arrayOf(PropTypes.shape()),
};
MachineMetrics.defaultProps = {
  metrics: [],
};

export default MachineMetrics;
