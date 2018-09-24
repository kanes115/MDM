import React, {Component} from 'react';
import PropTypes from 'prop-types';

// import ConnectionForm from './ConnectionForm/index';
import ConnectionForm from './NewConnectionForm/index';
import MachineForm from './MachineForm/index';
import ServiceForm from './ServiceForm/index';
import SystemConfigForm from './SystemConfigForm/index';
import SystemForm from './SystemForm/index';

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
