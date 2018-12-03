import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Form } from 'informed';

import {
  FormHeader,
  FormSection,
  InputField,
} from '../../../../FormElements';

import validateSystemName from './validation';

import './system-form.css';

class SystemForm extends Component {
  render() {
    const { onSubmit, setFormAPI } = this.props;

    return (
      <Form
        id="system-form"
        getApi={setFormAPI}
      >
        {({ formState }) => (
          <div className="system-form">
            <FormHeader title="New system" />
            <FormSection title="Basic information">
              <InputField
                id="system-name"
                error={_.get(formState, 'errors.name')}
                field="name"
                label="System name"
                validate={validateSystemName}
                validateOnBlur
                validateOnChange
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
                            Create system
            </button>
          </div>
        )
                }
      </Form>
    );
  }
}

SystemForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  setFormAPI: PropTypes.func.isRequired,
};
SystemForm.defaultProps = {};

export default SystemForm;
