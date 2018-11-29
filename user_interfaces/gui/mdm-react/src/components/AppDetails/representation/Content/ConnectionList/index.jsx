import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ConnectionListElement from './ConnectionListElement';

class ConnectionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: [],
    };
  }

  toggleConnectionExpanded = (connection) => {
    this.setState(prevState => {
      const { expanded } = prevState;

      const index = _.findIndex(expanded, con => _.isEqual(con, connection));

      if (index === -1) {
        return {
          expanded: [
            ...expanded,
            connection,
          ],
        }
      } else {
        const expandedCopy = _.cloneDeep(expanded);
        expandedCopy.splice(index, 1);
        return {
          expanded: expandedCopy,
        };
      }
    });
  };

  isExpanded = (connection) => {
    const { expanded } = this.state;

    const index = _.findIndex(expanded, con => _.isEqual(con, connection));

    return index !== -1;
  };

  render() {
    const { canModify, connections, onDeleteClick, onEditClick } = this.props;

    return connections.length > 0 && (
      <div>
        <h3>
          {'Connections'}
        </h3>
        <ul className="element-list">
          {connections.map(connection => (
            <ConnectionListElement
              key={`${connection.service_from}-${connection.service_to}`}
              canModify={canModify}
              isExpanded={this.isExpanded(connection)}
              connection={connection}
              onDeleteClick={() => onDeleteClick('connection', connection)}
              onEditClick={() => onEditClick('connection', connection)}
              toggleConnectionExpanded={this.toggleConnectionExpanded}
            />
          ))}
        </ul>
      </div>
    );
  }
}

ConnectionList.propTypes = {
  canModify: PropTypes.bool.isRequired,
  connections: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
};
ConnectionList.defaultProps = {};

export default ConnectionList;
