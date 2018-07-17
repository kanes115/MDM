import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Checkbox, Form, Option, Select, Text} from 'informed';

class ServiceForm extends Component {
    render() {
        return (
            <div className="service-form">
                <Form id="service-form">
                    {({formState}) =>
                        (<div>
                            <label htmlFor="service-name">
                                Service name
                            </label>
                            <Text field="name"
                                  id="service-name"
                            />

                            <label htmlFor="service-dir">
                                Service dir
                            </label>
                            <Text field="service_dir"
                                  id="service-dir"
                            />

                            <label htmlFor="service-executable">
                                Service executable
                            </label>
                            <Text field="service_executable"
                                  id="service-executable"
                            />

                            <label htmlFor="service-containerized">Containerized</label>
                            <Checkbox field="containerized"
                                      id="service-containerized"/>

                            <label htmlFor="service-os">OS:</label>
                            <Select field="requirements.os"
                                    id="service-os"
                                    multiple
                            >
                                <Option value="linux">Linux</Option>
                                <Option value="debian">Debian</Option>
                            </Select>

                            <label htmlFor="service-ram">
                                Required RAM
                            </label>
                            <Text field="requirements.RAM"
                                  id="service-ram"
                                  type="number"
                            />

                            <label htmlFor="service-hdd">
                                Required disk space
                            </label>
                            <Text field="requirements.HDD"
                                  id="service-hdd"
                                  type="number"
                            />

                            <button type="submit">
                                Create service
                            </button>

                            <div>
                                {JSON.stringify(formState)}
                            </div>
                        </div>)
                    }
                </Form>
            </div>
        );
    }
}

ServiceForm.propTypes = {};
ServiceForm.defaultProps = {};

export default ServiceForm;
