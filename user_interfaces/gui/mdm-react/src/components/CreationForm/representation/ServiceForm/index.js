import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {createNewService} from '../../../../actions';

import ServiceForm from './representation';

class ServiceFormWrapper extends Component {
    constructor(props) {
        super(props);

        this.serviceCreationFormAPI = null;
    }

    setFormAPI = (formAPI) => {
        this.serviceCreationFormAPI = formAPI;
    };

    onSubmit = () => {
        const {values: service} = this.serviceCreationFormAPI.getState();

        this.props.createService(service);
    };

    render() {
        const {availableMachineNames} = this.props;

        return (
            <ServiceForm availableMachineNames={availableMachineNames}
                         onSubmit={this.onSubmit}
                         setFormAPI={this.setFormAPI}/>
        );
    }
}

function mapStateToProps({systems, activeSystemId}) {
    const activeSystem = systems[activeSystemId];
    const availableMachineNames = activeSystem.machines.map(machine => machine.name);

    return {
        availableMachineNames,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        createService: (service) => dispatch(createNewService(service)),
    };
}

ServiceFormWrapper.propTypes = {
    availableMachineNames: PropTypes.arrayOf(PropTypes.string),
    createService: PropTypes.func.isRequired,
};
ServiceFormWrapper.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceFormWrapper);
