import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ModelEmpty from '../ModelEmpty';
import ModelGraph from '../ModelGraph';
import ModelHeader from '../ModelHeader';

class ModelContent extends Component {
    selectService = (service) => {
        return () => {
            const {selectingSource, selectingTarget} = this.props;

            if (selectingSource) {
                this.props.selectSource(service.name);
            } else if (selectingTarget) {
                this.props.selectTarget(service.name);
            }
        }
    };

    render() {
        const {connections, isModelEmpty, machines, services} = this.props;

        return (
            isModelEmpty ?
                (<ModelEmpty />)
                :
                (<div>
                    <ModelHeader />
                    <ModelGraph />
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
                        <div key={service.name}
                             onClick={this.selectService(service)}>
                            {JSON.stringify(service)}
                        </div>
                    ))}
                </div>)
        );
    }
}

function mapStateToProps(state) {
    const { jmmsr: { activeSystemId, systems } } = state;
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

ModelContent.propTypes = {
    connections: PropTypes.arrayOf(PropTypes.object).isRequired,
    isModelEmpty: PropTypes.bool.isRequired,
    machines: PropTypes.arrayOf(PropTypes.object).isRequired,
    services: PropTypes.arrayOf(PropTypes.object).isRequired,
};
ModelContent.defaultProps = {};

export default connect(mapStateToProps)(ModelContent);
