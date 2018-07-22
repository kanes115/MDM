import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form} from 'informed';

import {
    CheckboxField,
    FormHeader,
    FormSection,
    SelectionField,
} from '../../../../FormElements/index';

import './system-config-form.css';

class SystemConfigForm extends Component {
    render() {
        const {
            availableMachines,
            config,
            onSubmit,
            setFormAPI,
        } = this.props;

        return (
            <Form id="system-config-form"
                  getApi={setFormAPI}
                  initialValues={config}>
                {({formState}) =>
                    (<div className="system-config-form">
                        <FormHeader title="system configuration"/>
                        <FormSection title="Metrics">
                            <SelectionField id="system-metrics"
                                            field="metrics"
                                            label="Gathered metrics"
                                            multiple
                                            options={[
                                                {
                                                    optionLabel: 'CPU',
                                                    optionValue: 'cpu'
                                                },
                                                {
                                                    optionLabel: 'Network',
                                                    optionValue: 'net'
                                                },
                                                {
                                                    optionLabel: 'Memory',
                                                    optionValue: 'mem'
                                                },
                                            ]}/>
                            <CheckboxField id="persist"
                                           field="persist"
                                           label="Persist"/>
                        </FormSection>
                        <FormSection title="Distinguished machines">
                            <SelectionField id="persist-machine"
                                            field="persist_machine"
                                            label="Persistence machine"
                                            options={availableMachines.map(availableMachine => ({
                                                optionLabel: availableMachine.name,
                                                optionValue: availableMachine.id,
                                            }))}/>
                            <SelectionField id="pilot-machine"
                                            field="pilot_machine"
                                            label="Pilot machine"
                                            options={availableMachines.map(availableMachine => ({
                                                optionLabel: availableMachine.name,
                                                optionValue: availableMachine.id,
                                            }))}/>
                        </FormSection>

                        <button type="submit"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onSubmit();
                                }}>
                            Update system
                        </button>
                    </div>)
                }
            </Form>
        );
    }
}

SystemConfigForm.propTypes = {
    availableMachines: PropTypes.arrayOf(PropTypes.object).isRequired,
    config: PropTypes.shape({
        metrics: PropTypes.arrayOf(PropTypes.oneOf([
            'cpu', 'net', 'mem',
        ])).isRequired,
        persist: PropTypes.bool.isRequired,
        persist_machine: PropTypes.number,
        pilot_machine: PropTypes.number,
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
    setFormAPI: PropTypes.func.isRequired,
};
SystemConfigForm.defaultProps = {
    persist_machine: null,
    pilot_machine: null,
};

export default SystemConfigForm;
