import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {openForm} from '../../actions/index';

import CreationButton from './representation/index';

class CreationButtonWrapper extends Component {
    state = {
        active: false,
    };

    toggleCreationPanel = () => {
        this.setState(prevState => ({
            active: !prevState.active,
        }));
    };

    handleConnectionCreation = () => {
        this.props.openCreationForm('connection');
    };

    handleMachineCreation = () => {
        this.props.openCreationForm('machine');
    };

    handleServiceCreation = () => {
        this.props.openCreationForm('service');
    };

    handleSystemConfiguration = () => {
        this.props.openCreationForm('systemConfig');
    };

    handleSystemCreation = () => {
        this.props.openCreationForm('system');
    };

    render() {
        const {active} = this.state;
        const {formOpen, isSystemActive} = this.props;

        return (
            <CreationButton active={active}
                            formActive={formOpen}
                            handleConnectionCreation={this.handleConnectionCreation}
                            handleMachineCreation={this.handleMachineCreation}
                            handleServiceCreation={this.handleServiceCreation}
                            handleSystemConfiguration={this.handleSystemConfiguration}
                            handleSystemCreation={this.handleSystemCreation}
                            isSystemActive={isSystemActive}
                            toggleCreation={this.toggleCreationPanel}
            />
        );
    }
}

function mapStateToProps({activeSystemId, form: {formOpen}}) {
    return {
        formOpen,
        isSystemActive: activeSystemId.length > 0,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        openCreationForm: (formType) => dispatch(openForm(formType)),
    };
}

CreationButtonWrapper.propTypes = {
    formOpen: PropTypes.bool.isRequired,
    isSystemActive: PropTypes.bool.isRequired,
    openCreationForm: PropTypes.func.isRequired,
};
CreationButtonWrapper.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CreationButtonWrapper);
