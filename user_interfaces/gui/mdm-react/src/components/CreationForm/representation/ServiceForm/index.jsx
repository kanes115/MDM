import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {
  createNewService,
  updateService,
} from '../../../../actions';

import ServiceForm from './representation/index';

class ServiceFormWrapper extends Component {
  constructor(props) {
    super(props);

    this.serviceCreationFormAPI = null;
  }

  setFormAPI = (formAPI) => {
    const { formObject } = this.props;
    this.serviceCreationFormAPI = formAPI;

    if (formObject) {
      this.serviceCreationFormAPI.setValues(formObject);
    }

  };

  onSubmit = () => {
    const { createService, formObject, updateService } = this.props;
    const { values: service } = this.serviceCreationFormAPI.getState();

    if (formObject) {
      updateService(service);
    } else {
      createService(service);
    }
  };

  render() {
    const {availableMachineNames} = this.props;

    return (
      <ServiceForm availableMachineNames={availableMachineNames}
                   onSubmit={this.onSubmit}
                   setFormAPI={this.setFormAPI}/>
    );
  }
}

function mapStateToProps({
  jmmsr: {
    systems,
    activeSystemId,
    form: { formObject },
  },
}) {
  const activeSystem = systems[activeSystemId];
  const availableMachineNames = activeSystem.machines.map(machine => machine.name);

  return {
    availableMachineNames,
    formObject,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createService: (service) => dispatch(createNewService(service)),
    updateService: (service) => dispatch(updateService(service)),
  };
}

ServiceFormWrapper.propTypes = {
  availableMachineNames: PropTypes.arrayOf(PropTypes.string),
  createService: PropTypes.func.isRequired,
  formObject: PropTypes.shape({}),
  updateService: PropTypes.func.isRequired,
};
ServiceFormWrapper.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceFormWrapper);
