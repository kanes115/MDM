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
    const availableMachines = _.map(
      _.get(service, 'requirements.available_machines', []),
      availableMachine => Number.parseInt(availableMachine, 10),
    );
    _.set(service, 'requirements.available_machines', availableMachines);
    const hdd = _.get(service, 'requirements.HDD');
    _.set(service, 'requirements.HDD', Number.parseInt(hdd, 10));
    const ram = _.get(service, 'requirements.RAM');
    _.set(service, 'requirements.RAM', Number.parseInt(ram, 10));


    if (_.isEmpty(errors)) {
      if (formObject) {
        updateService(service, formObject);
      } else {
        createService(service);
      }
    }
  };

  render() {
    const { availableMachines, originalName, serviceNames } = this.props;

    return (
      <ServiceForm
        availableMachines={availableMachines}
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
  const availableMachines = activeSystem.machines.map(machine => ({
    optionValue: machine.id,
    optionLabel: machine.name,
  }));
  const serviceNames = activeSystem.services.map(service => service.name);
  const originalName = _.get(formObject, 'name', null);

  return {
    availableMachines,
    formObject,
    originalName,
    serviceNames,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createService: (service) => dispatch(createNewService(service)),
    updateService: (newService, oldService) => dispatch(updateService(newService, oldService)),
  };
}

ServiceFormWrapper.propTypes = {
  availableMachines: PropTypes.arrayOf(PropTypes.shape({
    optionValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    optionLabel: PropTypes.string,
  })),
  createService: PropTypes.func.isRequired,
  formObject: PropTypes.shape({}),
  originalName: PropTypes.string,
  serviceNames: PropTypes.arrayOf(PropTypes.string),
  updateService: PropTypes.func.isRequired,
};
ServiceFormWrapper.defaultProps = {
  availableMachines: [],
  originalName: null,
  serviceNames: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceFormWrapper);
