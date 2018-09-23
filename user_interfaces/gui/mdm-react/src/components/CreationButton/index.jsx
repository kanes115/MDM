import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deploySystem } from '../../providers/websocket';

import { openForm } from '../../actions';

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

    handleSystemDeployment = () => {
        const { activeSystem } = this.props;

        deploySystem(activeSystem);
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
                            handleSystemDeployment={this.handleSystemDeployment}
                            isSystemActive={isSystemActive}
                            toggleCreation={this.toggleCreationPanel}
            />
        );
    }
}

function mapStateToProps({ jmmsr: { activeSystemId, form: { formOpen }, systems } }) {
    const activeSystem = systems[activeSystemId];

    return {
        activeSystem,
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
    activeSystem: PropTypes.shape({}),
    formOpen: PropTypes.bool.isRequired,
    isSystemActive: PropTypes.bool.isRequired,
    openCreationForm: PropTypes.func.isRequired,
};
CreationButtonWrapper.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CreationButtonWrapper);
