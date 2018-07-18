import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import {MDMLink} from '../../../../components';

const AppNavLink = ({icon, label}) => (
    <Fragment>
        <div className="nav-icon">
            <i className="material-icons">{icon}</i>
        </div>
        <MDMLink label={label}/>
    </Fragment>
);

AppNavLink.propTypes = {
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};
AppNavLink.defaultProps = {};

export default AppNavLink;
