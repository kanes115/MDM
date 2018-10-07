import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import AppDetails from './representation';

class AppDetailsContainer extends Component {
  render() {
    const { activeSystem, isModelEmpty } = this.props;

    return (
      <AppDetails
        activeSystem={activeSystem}
        isModelEmpty={isModelEmpty}
      />
    );
  }
}

AppDetailsContainer.propTypes = {
  activeSystem: PropTypes.shape({
    config: PropTypes.object,
    connections: PropTypes.array,
    machines: PropTypes.array,
    services: PropTypes.array,
  }),
  isModelEmpty: PropTypes.bool.isRequired,
};
AppDetailsContainer.defaultProps = {
  activeSystem: null,
};

function mapStateToProps({
  jmmsr: { activeSystemId, systems },
}) {
  const activeSystem = systems[activeSystemId];
  const isModelEmpty = _.get(activeSystem, 'connections.length', 0) === 0
    && _.get(activeSystem, 'machines.length', 0) === 0
    && _.get(activeSystem, 'services.length', 0) === 0;

  return {
    activeSystem,
    isModelEmpty,
  };
}

export default connect(mapStateToProps)(AppDetailsContainer);
