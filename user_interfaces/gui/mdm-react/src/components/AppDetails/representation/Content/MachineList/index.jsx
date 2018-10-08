import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MachineListElement from './MachineListElement';

class MachineList extends Component {
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
    const { machines } = this.props;
    const { expanded } = this.state;

    return machines.length > 0 && (
      <div>
        <h3>
          {'Machines'}
        </h3>
        <ul>
          {machines.map(machine => (
            <MachineListElement
              key={machine.id}
              canModify={true}
              isExpanded={expanded[machine.id]}
              machine={machine}
              onDeleteClick={() => console.log('delete', machine.id)}
              onEditClick={() => console.log('edit', machine.id)}
              toggleMachineExpanded={this.toggleMachineExpanded}
            />
          ))}
        </ul>
      </div>
    );
  }
}

MachineList.propTypes = {
  machines: PropTypes.arrayOf(PropTypes.object).isRequired,
};
MachineList.defaultProps = {};

export default MachineList;
