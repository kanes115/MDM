import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CreationButton from './CreationButton';
import CreationForm from './CreationForm';

class ModelPage extends Component {
    render() {
        return (
            <div>
                Model
                <CreationButton/>
                <CreationForm/>
            </div>
        );
    }
}

ModelPage.propTypes = {};
ModelPage.defaultProps = {};

export default ModelPage;
