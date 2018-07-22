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
        return (
            <ServiceForm onSubmit={this.onSubmit}
                         setFormAPI={this.setFormAPI}/>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createService: (service) => dispatch(createNewService(service)),
    };
}

ServiceFormWrapper.propTypes = {
    createService: PropTypes.func.isRequired,
};
ServiceFormWrapper.defaultProps = {};

export default connect(null, mapDispatchToProps)(ServiceFormWrapper);
