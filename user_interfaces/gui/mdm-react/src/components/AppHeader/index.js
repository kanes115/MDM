import React from 'react';
import {withRouter} from 'react-router-dom';

import './app-header.css';

const AppHeader = ({history}) => (
    <header className="mdm-header"
            onClick={() => history.push('/')}>
        <h1 className="title">MDM</h1>
    </header>
);

AppHeader.propTypes = {};
AppHeader.defaultProps = {};

export default withRouter(AppHeader);
