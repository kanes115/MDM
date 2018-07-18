import React, {Component} from 'react';

import {CreationButton, CreationForm} from '../../../components';

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
