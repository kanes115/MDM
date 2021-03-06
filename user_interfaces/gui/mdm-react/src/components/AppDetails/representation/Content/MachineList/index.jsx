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
    const { canModify, machines, onDeleteClick, onEditClick } = this.props;
    const { expanded } = this.state;

    return machines.length > 0 && (
      <div>
        <h3>
          {'Machines'}
        </h3>
        <ul className="element-list">
          {machines.map(machine => (
            <MachineListElement
              key={machine.id}
              canModify={canModify}
              isExpanded={expanded[machine.id]}
              machine={machine}
              onDeleteClick={() => onDeleteClick('machine', machine)}
              onEditClick={() => onEditClick('machine', machine)}
              toggleMachineExpanded={this.toggleMachineExpanded}
            />
          ))}
        </ul>
      </div>
    );
  }
}

MachineList.propTypes = {
  canModify: PropTypes.bool.isRequired,
  machines: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
};
MachineList.defaultProps = {};

export default MachineList;
