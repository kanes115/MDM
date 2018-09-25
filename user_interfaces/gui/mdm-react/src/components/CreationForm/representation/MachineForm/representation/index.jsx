import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';

import {
  FormHeader,
  FormSection,
  InputField,
  SelectionField,
} from '../../../../FormElements/index';

import './machine-form.css';

class MachineForm extends Component {
  render() {
    const { onSubmit, setFormAPI } = this.props;

    return (
      <Form
        id="machine-form"
        getApi={setFormAPI}
      >
        {({ formState }) => (
          <div className="machine-form">
            <FormHeader title="New machine" />
            <FormSection title="Basic information">
              <InputField
                id="machine-name"
                field="name"
                label="Machine name"
              />
              <SelectionField
                id="service-os"
                field="os"
                label="OS"
                options={[
                  {
                    optionLabel: 'Linux',
                    optionValue: 'linux',
                  },
                  {
                    optionLabel: 'Debian',
                    optionValue: 'debian',
                  },
                ]}
              />
            </FormSection>

            <FormSection title="Network">
              <InputField
                id="machine-domain"
                field="domain"
                label="Domain name"
              />
              <InputField
                id="machine-ip"
                field="ip"
                label="IP Address"
              />
              <InputField
                id="ssh-host"
                field="ssh_host"
                label="SSH host name"
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
                            Create machine
            </button>
          </div>
        )
                }
      </Form>
    );
  }
}

MachineForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  setFormAPI: PropTypes.func.isRequired,
};
MachineForm.defaultProps = {};

export default MachineForm;
