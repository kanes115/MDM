import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';

import {
  FormHeader,
  FormSection,
  InputField,
  SelectionField,
} from '../../../../FormElements';

const ConnectionForm = ({
  onSubmit,
  serviceNames,
  setFormAPI,
}) => (
  <Form
    id="service-form"
    getApi={setFormAPI}
  >
    {() => (
      <div className="service-form">
        <FormHeader title="New connection" />
        <FormSection title="Connection details">
          <InputField
            id="connection-port"
            field="port"
            label="Port"
            type="number"
          />
          <SelectionField
            id="connection-from"
            field="service_from"
            label="Connection from service"
            options={serviceNames.map(availableMachineName => ({
              optionLabel: availableMachineName,
              optionValue: availableMachineName,
            }))}
          />
          <SelectionField
            id="connection-to"
            field="service_to"
            label="Connection to service"
            options={serviceNames.map(availableMachineName => ({
              optionLabel: availableMachineName,
              optionValue: availableMachineName,
            }))}
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
          Create connection
        </button>
      </div>
    )
    }
  </Form>
);

ConnectionForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  setFormAPI: PropTypes.func.isRequired,
  serviceNames: PropTypes.arrayOf(PropTypes.string).isRequired,
};
ConnectionForm.defaultProps = {};

export default ConnectionForm;
