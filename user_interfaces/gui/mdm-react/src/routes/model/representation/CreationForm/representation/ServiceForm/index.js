import React, {Component} from 'react';
import {connect} from 'react-redux';

import ServiceForm from './representation';

class ServiceFormWrapper extends Component {
    render() {
        return (
            <ServiceForm/>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

ServiceFormWrapper.propTypes = {};
ServiceFormWrapper.defaultProps = {};

export default connect(null, mapDispatchToProps)(ServiceFormWrapper);
