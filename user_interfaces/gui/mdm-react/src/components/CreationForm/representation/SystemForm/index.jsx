import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {connect} from 'react-redux';

import {createNewSystem} from '../../../../actions';

import SystemForm from './representation/index';

class SystemFormWrapper extends Component {
    constructor(props) {
        super(props);

        this.systemCreationFormAPI = null;
    }

    setFormAPI = (formAPI) => {
        this.systemCreationFormAPI = formAPI;
    };

    onSubmit = () => {
        const { values: { name }, errors } = this.systemCreationFormAPI.getState();

        if (_.get(name, 'length', 0) === 0) {
            this.systemCreationFormAPI.setError('name', 'System name must not be empty');
        }

        if (_.isEmpty(errors) && _.get(name, 'length', 0) !== 0) {
          this.props.createSystem(name);
        }
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
