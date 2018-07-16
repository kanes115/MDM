import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CreationButton from './CreationButton';

class ModelPage extends Component {
    render() {
        return (
            <div>
                Model
                <CreationButton/>
            </div>
        );
    }
}

ModelPage.propTypes = {};
ModelPage.defaultProps = {};

export default ModelPage;
