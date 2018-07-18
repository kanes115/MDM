import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {createNewSystem} from '../../../../actions';

import SystemForm from './representation';

class SystemFormWrapper extends Component {
    constructor(props) {
        super(props);

        this.systemCreationFormAPI = null;
    }

    setFormAPI = (formAPI) => {
        this.systemCreationFormAPI = formAPI;
    };

    onSubmit = () => {
        const {values: {name}} = this.systemCreationFormAPI.getState();

        this.props.createSystem(name);
    };

    render() {
        return (
            <SystemForm onSubmit={this.onSubmit}
                        setFormAPI={this.setFormAPI}/>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createSystem: (systemName) => dispatch(createNewSystem(systemName)),
    };
}

SystemFormWrapper.propTypes = {
    createSystem: PropTypes.func.isRequired,
};
SystemFormWrapper.defaultProps = {};

export default connect(null, mapDispatchToProps)(SystemFormWrapper);
