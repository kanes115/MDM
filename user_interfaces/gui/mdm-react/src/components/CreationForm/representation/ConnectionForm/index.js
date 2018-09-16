import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {createNewConnection, toggleSourceSelection, toggleTargetSelection} from '../../../../actions';

import ConnectionForm from './representation';

class ConnectionFormWrapper extends Component {
    constructor(props) {
        super(props);

        this.connectionCreationFormAPI = null;
    }

    setFormAPI = (formAPI) => {
        this.connectionCreationFormAPI = formAPI;
    };

    onSubmit = () => {
        const {service_from, service_to} = this.props;
        const {values: {port}} = this.connectionCreationFormAPI.getState();

        this.props.createConnection({
            service_from,
            service_to,
            port,
        });
    };

    toggleSource = () => {
        const {selectingTarget, toggleSource: toggle} = this.props;

        if (!selectingTarget) {
            toggle();
        }
    };

    toggleTarget = () => {
        const {selectingSource, toggleTarget: toggle} = this.props;

        if (!selectingSource) {
            toggle();
        }
    };

    render() {
        const {selectingSource, selectingTarget, source, target} = this.props;

        return (
            <ConnectionForm onSubmit={this.onSubmit}
                            toggleSource={this.toggleSource}
                            toggleTarget={this.toggleTarget}
                            selectingSource={selectingSource}
                            selectingTarget={selectingTarget}
                            setFormAPI={this.setFormAPI}
                            source={source}
                            target={target}/>
        );
    }
}

function mapStateToProps({ jmmsr: { activeSystemId, form: { connectionForm }, systems } }) {
    const {selectingSource, selectingTarget, service_from, service_to} = connectionForm;
    const activeSystemServices = systems[activeSystemId].services;
    let source = {};
    let target = {};
    activeSystemServices.forEach(service => {
        if (service.name === service_from) {
            source = service;
        } else if (service.name === service_to) {
            target = service;
        }
    });

    return {
        selectingSource,
        selectingTarget,
        service_from,
        service_to,
        source,
        target,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        createConnection: (connection) => dispatch(createNewConnection(connection)),
        toggleSource: () => dispatch(toggleSourceSelection()),
        toggleTarget: () => dispatch(toggleTargetSelection()),
    };
}

ConnectionFormWrapper.propTypes = {
    createConnection: PropTypes.func.isRequired,
    selectingSource: PropTypes.bool.isRequired,
    selectingTarget: PropTypes.bool.isRequired,
    service_from: PropTypes.string.isRequired,
    service_to: PropTypes.string.isRequired,
    source: PropTypes.object.isRequired,
    target: PropTypes.object.isRequired,
    toggleSource: PropTypes.func.isRequired,
    toggleTarget: PropTypes.func.isRequired,
};
ConnectionFormWrapper.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionFormWrapper);
