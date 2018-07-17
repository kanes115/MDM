import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ServiceForm from './ServiceForm';

import {CloseIcon} from '../../../../../components';

import './creation-form.css';

class CreationForm extends Component {
    renderForm = (formType) => {
        switch (formType) {
            case 'connection':
                return (<div>connection</div>);
            case 'machine':
                return (<div>machine</div>);
            case 'service':
                return <ServiceForm/>;
            default:
                return null;
        }
    };

    render() {
        const {formType, onClose} = this.props;

        return (
            <div className="mdm-creation-form">
                <CloseIcon onClose={onClose}/>
                {this.renderForm(formType)}
            </div>
        );
    }
}

CreationForm.propTypes = {
    formType: PropTypes.oneOf([
        'connection',
        'machine',
        'service',
    ]).isRequired,
    onClose: PropTypes.func.isRequired,
};
CreationForm.defaultProps = {};

export default CreationForm;
