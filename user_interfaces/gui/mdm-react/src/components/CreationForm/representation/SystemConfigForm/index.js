import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {createNewSystem} from '../../../../actions';

import SystemConfigForm from './representation';

class SystemConfigFormWrapper extends Component {
    constructor(props) {
        super(props);

        this.systemCreationFormAPI = null;
    }

    setFormAPI = (formAPI) => {
        this.systemCreationFormAPI = formAPI;
    };

    onSubmit = () => {
        console.log(this.systemCreationFormAPI.getState())
    };

    render() {
        return (
            <SystemConfigForm onSubmit={this.onSubmit}
                              setFormAPI={this.setFormAPI}/>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createSystem: (systemName) => dispatch(createNewSystem(systemName)),
    };
}

SystemConfigFormWrapper.propTypes = {
    createSystem: PropTypes.func.isRequired,
};
SystemConfigFormWrapper.defaultProps = {};

export default connect(null, mapDispatchToProps)(SystemConfigFormWrapper);
