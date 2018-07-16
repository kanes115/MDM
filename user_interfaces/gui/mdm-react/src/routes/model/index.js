import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ModelPage from './representation';

class ModelPageWrapper extends Component {
    render() {
        return (
            <ModelPage/>
        );
    }
}

ModelPageWrapper.propTypes = {};
ModelPageWrapper.defaultProps = {};

export default ModelPageWrapper;
