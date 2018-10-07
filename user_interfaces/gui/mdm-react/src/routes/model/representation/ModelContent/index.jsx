import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ModelEmpty from '../ModelEmpty';
import ModelGraph from '../ModelGraph';
import ModelHeader from '../ModelHeader';

class ModelContent extends Component {
  render() {
    const { isModelEmpty } = this.props;

    return (
      isModelEmpty
        ? (
          <ModelEmpty />
        )
        : (
          <div>
            <ModelHeader />
            <ModelGraph />
          </div>
        )
    );
  }
}

function mapStateToProps(state) {
  const { jmmsr: { activeSystemId, systems } } = state;
  const activeSystem = systems[activeSystemId];
  const isModelEmpty = activeSystem.connections.length === 0
    && activeSystem.machines.length === 0
    && activeSystem.services.length === 0;

  return {
    isModelEmpty,
  };
}

ModelContent.propTypes = {
  isModelEmpty: PropTypes.bool.isRequired,
};
ModelContent.defaultProps = {};

export default connect(mapStateToProps)(ModelContent);
