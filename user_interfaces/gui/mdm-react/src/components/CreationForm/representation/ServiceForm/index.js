import React, {Component} from 'react';
import {connect} from 'react-redux';

import ServiceForm from './representation';

class ServiceFormWrapper extends Component {
    constructor(props) {
        super(props);

        this.serviceCreationFormAPI = null;
    }

    setFormAPI = (formAPI) => {
        console.log(formAPI)
        this.serviceCreationFormAPI = formAPI;
    };

    onSubmit = () => {
        const {values: service} = this.serviceCreationFormAPI.getState();
        console.log(this.serviceCreationFormAPI.getState())


    };

    render() {
        return (
            <ServiceForm onSubmit={this.onSubmit}
                         setFormAPI={this.setFormAPI}/>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {};
}

ServiceFormWrapper.propTypes = {};
ServiceFormWrapper.defaultProps = {};

export default connect(null, mapDispatchToProps)(ServiceFormWrapper);
