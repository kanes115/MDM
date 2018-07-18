import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form} from 'informed';

import {
    FormHeader,
} from '../../../../FormElements/index';

import './system-config-form.css';

class SystemConfigForm extends Component {
    render() {
        const {onSubmit, setFormAPI} = this.props;

        return (
            <Form id="system-config-form"
                  getApi={setFormAPI}>
                {({formState}) =>
                    (<div className="system-config-form">
                        <FormHeader title="system configuration"/>

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
    onSubmit: PropTypes.func.isRequired,
    setFormAPI: PropTypes.func.isRequired,
};
SystemConfigForm.defaultProps = {};

export default SystemConfigForm;
