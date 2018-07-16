import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CreationButton from './representation';

class CreationButtonWrapper extends Component {
    state = {
        active: false,
        formActive: false,
    };

    toggleCreationPanel = () => {
        this.setState(prevState => ({
            active: !prevState.active,
        }));
    };

    handleConnectionCreation = () => {
        console.log('create connection')
    };

    handleMachineCreation = () => {
        console.log('create machine')
    };

    handleServiceCreation = () => {
        console.log('create service')
    };

    render() {
        const {active, formActive} = this.state;

        return (
            <CreationButton active={active}
                            formActive={formActive}
                            handleConnectionCreation={this.handleConnectionCreation}
                            handleMachineCreation={this.handleMachineCreation}
                            handleServiceCreation={this.handleServiceCreation}
                            toggleCreation={this.toggleCreationPanel}
            />
        );
    }
}

CreationButtonWrapper.propTypes = {};
CreationButtonWrapper.defaultProps = {};

export default CreationButtonWrapper;
