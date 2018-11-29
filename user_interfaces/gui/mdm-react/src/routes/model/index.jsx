import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { openForm } from '../../actions';

import ModelPage from './representation/index';

class ModelPageWrapper extends Component {
  render() {
    const { downloadingSystem, isSystemActive, openSystemCreationForm, stoppedSystemInfoOpen } = this.props;

    return !downloadingSystem && !stoppedSystemInfoOpen && (
      <ModelPage
        isSystemActive={isSystemActive}
        openSystemCreationForm={openSystemCreationForm}
      />
    );
  }
}

function mapStateToProps({ jmmsr: { activeSystemId, downloadingSystem, stoppedSystemInfoOpen } }) {
  return {
    downloadingSystem,
    isSystemActive: activeSystemId.length > 0,
    stoppedSystemInfoOpen,
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
