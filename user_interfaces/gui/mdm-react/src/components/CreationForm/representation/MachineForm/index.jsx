import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {createNewMachine} from '../../../../actions';

import MachineForm from './representation/index';

class MachineFormWrapper extends Component {
    constructor(props) {
        super(props);

        this.machineCreationFormAPI = null;
    }

    setFormAPI = (formAPI) => {
        this.machineCreationFormAPI = formAPI;
    };

    onSubmit = () => {
        const {values: machine} = this.machineCreationFormAPI.getState();

        this.props.createMachine(machine);
    };

    render() {
        return (
            <MachineForm onSubmit={this.onSubmit}
                         setFormAPI={this.setFormAPI}/>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createMachine: (machine) => dispatch(createNewMachine(machine)),
    };
}

MachineFormWrapper.propTypes = {
    createMachine: PropTypes.func.isRequired,
};
MachineFormWrapper.defaultProps = {};

export default connect(null, mapDispatchToProps)(MachineFormWrapper);
