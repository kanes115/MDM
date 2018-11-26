import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { openForm } from '../../actions';

import ModelPage from './representation/index';

class ModelPageWrapper extends Component {
  render() {
    const { downloadingSystem, isSystemActive, openSystemCreationForm } = this.props;

    return !downloadingSystem && (
      <ModelPage
        isSystemActive={isSystemActive}
        openSystemCreationForm={openSystemCreationForm}
      />
    );
  }
}

function mapStateToProps({ jmmsr: { activeSystemId, downloadingSystem } }) {
  return {
    downloadingSystem,
    isSystemActive: activeSystemId.length > 0,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    openSystemCreationForm: () => dispatch(openForm('system')),
  };
}

ModelPageWrapper.propTypes = {
  downloadingSystem: PropTypes.bool.isRequired,
  isSystemActive: PropTypes.bool.isRequired,
  openSystemCreationForm: PropTypes.func.isRequired,
};
ModelPageWrapper.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ModelPageWrapper);
