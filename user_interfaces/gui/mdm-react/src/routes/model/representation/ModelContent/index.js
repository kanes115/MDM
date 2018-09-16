import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {selectConnectionSource, selectConnectionTarget} from '../../../../actions';

import {EmptyState} from '../../../../components';

import ModelGraph from '../ModelGraph';

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
                (<EmptyState iconName="category">
                    <div>System model is empty</div>
                    <div>
                        Use the button in bottom right corner to add elements
                    </div>
                </EmptyState>)
                :
                (<div>
                    <ModelGraph/>
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
    const { jmmsr: { activeSystemId, form, systems } } = state;
    const activeSystem = systems[activeSystemId];
    const isModelEmpty = activeSystem.connections.length === 0 &&
        activeSystem.machines.length === 0 &&
        activeSystem.services.length === 0;
    const {connectionForm: {selectingSource, selectingTarget}} = form;

    return {
        connections: activeSystem.connections,
        isModelEmpty,
        machines: activeSystem.machines,
        selectingSource,
        selectingTarget,
        services: activeSystem.services,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectSource: (serviceName) => dispatch(selectConnectionSource(serviceName)),
        selectTarget: (serviceName) => dispatch(selectConnectionTarget(serviceName)),
    };
}

ModelContent.propTypes = {
    connections: PropTypes.arrayOf(PropTypes.object).isRequired,
    isModelEmpty: PropTypes.bool.isRequired,
    machines: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectingSource: PropTypes.bool.isRequired,
    selectingTarget: PropTypes.bool.isRequired,
    selectSource: PropTypes.func.isRequired,
    selectTarget: PropTypes.func.isRequired,
    services: PropTypes.arrayOf(PropTypes.object).isRequired,
};
ModelContent.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ModelContent);
