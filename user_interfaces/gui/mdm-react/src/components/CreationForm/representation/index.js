import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ConnectionForm from './ConnectionForm';
import MachineForm from './MachineForm';
import ServiceForm from './ServiceForm';
import SystemConfigForm from './SystemConfigForm';
import SystemForm from './SystemForm';

import {CloseIcon} from '../../index';

import './creation-form.css';

class CreationForm extends Component {
    renderForm = (formType) => {
        switch (formType) {
            case 'connection':
                return (<ConnectionForm/>);
            case 'machine':
                return (<MachineForm/>);
            case 'service':
                return <ServiceForm/>;
            case 'systemConfig':
                return <SystemConfigForm/>;
            case 'system':
                return <SystemForm/>;
            default:
                return null;
        }
    };

    render() {
        const {formOpen, formType, onClose} = this.props;

        return (
            formOpen &&
            (<div className="mdm-creation-form">
                <CloseIcon onClose={onClose}/>
                {this.renderForm(formType)}
            </div>)
        );
    }
}

CreationForm.propTypes = {
    formOpen: PropTypes.bool.isRequired,
    formType: PropTypes.oneOf([
        'connection',
        'machine',
        'service',
        'systemConfig',
        'system',
        '',
    ]).isRequired,
    onClose: PropTypes.func.isRequired,
};
CreationForm.defaultProps = {};

export default CreationForm;
