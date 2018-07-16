import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {openForm} from '../../../../actions';

import CreationButton from './representation';

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

    render() {
        const {active} = this.state;
        const {formOpen} = this.props;

        return (
            <CreationButton active={active}
                            formActive={formOpen}
                            handleConnectionCreation={this.handleConnectionCreation}
                            handleMachineCreation={this.handleMachineCreation}
                            handleServiceCreation={this.handleServiceCreation}
                            toggleCreation={this.toggleCreationPanel}
            />
        );
    }
}

function mapStateToProps({form: {formOpen}}) {
    return {
        formOpen,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        openCreationForm: (formType) => dispatch(openForm(formType)),
    };
}

CreationButtonWrapper.propTypes = {
    formOpen: PropTypes.bool.isRequired,
    openCreationForm: PropTypes.func.isRequired,
};
CreationButtonWrapper.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CreationButtonWrapper);
