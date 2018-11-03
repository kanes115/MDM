import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeForm } from '../../actions';

import CreationForm from './representation';

class CreationFormWrapper extends Component {
  render() {
    const { closeCreationForm, formOpen, formType } = this.props;

    return (
      <CreationForm
        formOpen={formOpen}
        formType={formType}
        onClose={closeCreationForm}
      />
    );
  }
}

function mapStateToProps({ jmmsr: { form: { formOpen, formType } } }) {
  return {
    formOpen,
    formType,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeCreationForm: () => dispatch(closeForm()),
  };
}

CreationFormWrapper.propTypes = {
  closeCreationForm: PropTypes.func.isRequired,
  formOpen: PropTypes.bool.isRequired,
  formType: PropTypes.oneOf([
    'connection',
    'machine',
    'service',
    'systemConfig',
    'system',
    '',
  ]),
};
CreationFormWrapper.defaultProps = {
  formType: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(CreationFormWrapper);
