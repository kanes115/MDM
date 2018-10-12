import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';
import _ from 'lodash';

import validateServiceName from './validation';

import {
  CheckboxField,
  FormHeader,
  FormSection,
  InputField,
  SelectionField,
} from '../../../../FormElements';

import './service-form.css';

class ServiceForm extends Component {
  render() {
    const {
      availableMachineNames,
      onSubmit,
      originalName,
      serviceNames,
      setFormAPI,
    } = this.props;

    return (
      <Form
        id="service-form"
        getApi={setFormAPI}
      >
        {({ formState }) => (
          <div className="service-form">
            <FormHeader title="Service" />
            <FormSection title="Basic information">
              <InputField
                id="service-name"
                error={_.get(formState, 'errors.name')}
                field="name"
                label="Service name"
                validate={validateServiceName(serviceNames, originalName)}
                validateOnBlur
                validateOnChange
              />
              <InputField
                id="service-dir"
                field="service_dir"
                label="Service directory path"
              />
              <InputField
                id="service-executable"
                field="service_executable"
                label="Service executable path"
              />
              <CheckboxField
                id="service-containerized"
                field="containerized"
                label="Containerized"
              />
            </FormSection>

            <FormSection title="Service requirements">
              <SelectionField
                id="service-machines"
                field="requirements.available_machines"
                label="Available machines"
                multiple
                options={availableMachineNames.map(availableMachineName => ({
                  optionLabel: availableMachineName,
                  optionValue: availableMachineName,
                }))}
              />
              <SelectionField
                id="service-os"
                field="requirements.os"
                label="OS"
                multiple
                options={[
                  {
                    optionLabel: 'Linux',
                    optionValue: 'linux',
                  },
                ]}
              />
              <InputField
                id="service-ram"
                field="requirements.RAM"
                label="Required RAM"
                type="number"
              />
              <InputField
                id="service-hdd"
                field="requirements.HDD"
                label="Required disk space"
                type="number"
              />
            </FormSection>

            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSubmit();
              }}
            >
              {'Submit'}
            </button>
          </div>
        )}
      </Form>
    );
  }
}

ServiceForm.propTypes = {
  availableMachineNames: PropTypes.arrayOf(PropTypes.string),
  onSubmit: PropTypes.func.isRequired,
  originalName: PropTypes.string,
  serviceNames: PropTypes.arrayOf(PropTypes.string),
  setFormAPI: PropTypes.func.isRequired,
};
ServiceForm.defaultProps = {
  availableMachineNames: [],
  originalName: null,
  serviceNames: [],
};

export default ServiceForm;
