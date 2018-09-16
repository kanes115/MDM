import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';

import {
  FormHeader,
  FormSection,
  InputField,
} from '../../../../FormElements';

import ConnectionInput from './ConnectionInput/index';

import './connection-form.css';

class ConnectionForm extends Component {
  render() {
    const {
      onSubmit,
      selectingSource,
      selectingTarget,
      setFormAPI,
      source,
      target,
      toggleSource,
      toggleTarget,
    } = this.props;

    return (
      <Form
        id="connection-form"
        getApi={setFormAPI}
      >
        {({ formState }) => (
          <div className="connection-form">
            <FormHeader title="New connection" />
            <FormSection title="Connection details">
              <InputField
                id="connection-port"
                field="port"
                label="Port"
                type="number"
              />
              <ConnectionInput
                selectingSource={selectingSource}
                selectingTarget={selectingTarget}
                source={source}
                target={target}
                toggleSource={toggleSource}
                toggleTarget={toggleTarget}
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
  }
}

ConnectionForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  selectingSource: PropTypes.bool.isRequired,
  selectingTarget: PropTypes.bool.isRequired,
  setFormAPI: PropTypes.func.isRequired,
  source: PropTypes.object.isRequired,
  target: PropTypes.object.isRequired,
  toggleSource: PropTypes.func.isRequired,
  toggleTarget: PropTypes.func.isRequired,
};
ConnectionForm.defaultProps = {};

export default ConnectionForm;
