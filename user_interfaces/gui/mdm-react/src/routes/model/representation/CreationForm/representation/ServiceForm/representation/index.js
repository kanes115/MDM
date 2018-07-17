import React, {Component} from 'react';
import {Form} from 'informed';

import {
    CheckboxField,
    FormHeader,
    FormSection,
    InputField,
    SelectionField,
} from '../../../../../../../components/FormElements';

import './service-form.css';

class ServiceForm extends Component {
    render() {
        return (
            <Form id="service-form">
                {({formState}) =>
                    (<div className="service-form">
                        <FormHeader title="New service"/>
                        <FormSection title="Basic information">
                            <InputField id="service-name"
                                        field="name"
                                        label="Service name"/>
                            <InputField id="service-dir"
                                        field="service_dir"
                                        label="Service directory path"/>
                            <InputField id="service-executable"
                                        field="service_executable"
                                        label="Service executable path"/>
                            <CheckboxField id="service-containerized"
                                           field="containerized"
                                           label="Containerized"/>
                        </FormSection>

                        <FormSection title="Service requirements">
                            <SelectionField id="service-os"
                                            field="requirements.os"
                                            label="OS"
                                            multiple
                                            options={[
                                                {
                                                    optionLabel: 'Linux',
                                                    optionValue: 'linux'
                                                },
                                                {
                                                    optionLabel: 'Debian',
                                                    optionValue: 'debian'
                                                },
                                            ]}/>
                            <InputField id="service-ram"
                                        field="requirements.RAM"
                                        label="Required RAM"
                                        type="number"/>
                            <InputField id="service-hdd"
                                        field="requirements.HDD"
                                        label="Required disk space"
                                        type="number"/>
                        </FormSection>

                        <button type="submit">
                            Create service
                        </button>

                        <div>
                            {JSON.stringify(formState)}
                        </div>
                    </div>)
                }
            </Form>
        );
    }
}

ServiceForm.propTypes = {};
ServiceForm.defaultProps = {};

export default ServiceForm;
