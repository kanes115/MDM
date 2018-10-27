import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {
  createNewMachine,
  updateMachine,
} from '../../../../actions';

import MachineForm from './representation/index';

class MachineFormWrapper extends Component {
  constructor(props) {
    super(props);

    this.machineCreationFormAPI = null;
  }

  setFormAPI = (formAPI) => {
    const { formObject } = this.props;
    this.machineCreationFormAPI = formAPI;

    if (formObject) {
      this.machineCreationFormAPI.setValues(formObject);
    }
  };

  onSubmit = () => {
    const { createMachine, formObject, updateMachine } = this.props;
    const { values: machine } = this.machineCreationFormAPI.getState();

    if (formObject) {
      updateMachine(machine, formObject);
    } else {
      createMachine(machine);
    }
  };

  render() {
    return (
      <MachineForm
        onSubmit={this.onSubmit}
        setFormAPI={this.setFormAPI}
      />
    );
  }
}

function mapStateToProps({
  jmmsr: {form: {formObject}},
}) {
  return {
    formObject,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createMachine: (machine) => dispatch(createNewMachine(machine)),
    updateMachine: (newMachine, oldMachine) => dispatch(updateMachine(newMachine, oldMachine)),
  };
}

MachineFormWrapper.propTypes = {
  createMachine: PropTypes.func.isRequired,
  formObject: PropTypes.shape({}),
  updateMachine: PropTypes.func.isRequired,
};
MachineFormWrapper.defaultProps = {
  formObject: null
};

export default connect(mapStateToProps, mapDispatchToProps)(MachineFormWrapper);
