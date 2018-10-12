import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import _ from 'lodash';

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
    const { values: service, errors } = this.serviceCreationFormAPI.getState();

    if (_.isEmpty(errors)) {
      if (formObject) {
        updateService(service);
      } else {
        createService(service);
      }
    }
  };

  render() {
    const { availableMachineNames, originalName, serviceNames } = this.props;

    return (
      <ServiceForm
        availableMachineNames={availableMachineNames}
        onSubmit={this.onSubmit}
        originalName={originalName}
        serviceNames={serviceNames}
        setFormAPI={this.setFormAPI}
      />
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
  const serviceNames = activeSystem.services.map(service => service.name);
  const originalName = _.get(formObject, 'name', null);

  return {
    availableMachineNames,
    formObject,
    originalName,
    serviceNames,
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
  originalName: PropTypes.string,
  serviceNames: PropTypes.arrayOf(PropTypes.string),
  updateService: PropTypes.func.isRequired,
};
ServiceFormWrapper.defaultProps = {
  originalName: null,
  serviceNames: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceFormWrapper);
