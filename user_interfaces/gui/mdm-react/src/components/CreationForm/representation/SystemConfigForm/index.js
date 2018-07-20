import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import _ from 'lodash';

import {createNewSystem} from '../../../../actions';

import SystemConfigForm from './representation';

class SystemConfigFormWrapper extends Component {
    constructor(props) {
        super(props);

        this.systemConfigFormAPI = null;
    }

    setFormAPI = (formAPI) => {
        this.systemConfigFormAPI = formAPI;
    };

    onSubmit = () => {
        console.log(this.systemConfigFormAPI.getState())
    };

    render() {
        const {
            availableMachines,
            config,
        } = this.props;

        return (
            <SystemConfigForm availableMachines={availableMachines}
                              config={_.cloneDeep(config)}
                              onSubmit={this.onSubmit}
                              setFormAPI={this.setFormAPI}/>
        );
    }
}

function mapStateToProps({activeSystemId, systems}) {
    const activeSystem = systems[activeSystemId];
    const availableMachines = [...activeSystem.machines];
    const config = activeSystem.config;

    return {
        availableMachines,
        config,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        createSystem: (systemName) => dispatch(createNewSystem(systemName)),
    };
}

SystemConfigFormWrapper.propTypes = {
    availableMachines: PropTypes.arrayOf(PropTypes.object).isRequired,
    config: PropTypes.shape({
        metrics: PropTypes.arrayOf(PropTypes.oneOf([
            'cpu', 'net', 'mem',
        ])).isRequired,
        persist: PropTypes.bool.isRequired,
        persist_machine: PropTypes.number,
        pilot_machine: PropTypes.number,
    }).isRequired,
    createSystem: PropTypes.func.isRequired,
};
SystemConfigFormWrapper.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SystemConfigFormWrapper);
