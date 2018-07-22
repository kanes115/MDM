import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {EmptyState} from '../../../../components';

class ModelContent extends Component {
    render() {
        const {connections, isModelEmpty, machines, services} = this.props;

        return (
            isModelEmpty ?
                (<EmptyState iconName="category">
                    <div>System model is empty</div>
                    <div>
                        Use the button in bottom right corner to add elements
                    </div>
                </EmptyState>)
                :
                (<div>
                    {connections.map((connection, index) => (
                        <div key={`connection_${index}`}>
                            {JSON.stringify(connection)}
                        </div>
                    ))}
                    {machines.map((machine, index) => (
                        <div key={`machine_${index}`}>
                            {JSON.stringify(machine)}
                        </div>
                    ))}
                    {services.map(service => (
                        <div key={service.name}>
                            {JSON.stringify(service)}
                        </div>
                    ))}
                </div>)
        );
    }
}

function mapStateToProps(state) {
    const {activeSystemId, systems} = state;
    const activeSystem = systems[activeSystemId];
    const isModelEmpty = activeSystem.connections.length === 0 &&
        activeSystem.machines.length === 0 &&
        activeSystem.services.length === 0;

    return {
        connections: activeSystem.connections,
        isModelEmpty,
        machines: activeSystem.machines,
        services: activeSystem.services,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

ModelContent.propTypes = {
    connections: PropTypes.arrayOf(PropTypes.object).isRequired,
    isModelEmpty: PropTypes.bool.isRequired,
    machines: PropTypes.arrayOf(PropTypes.object).isRequired,
    services: PropTypes.arrayOf(PropTypes.object).isRequired,
};
ModelContent.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ModelContent);
