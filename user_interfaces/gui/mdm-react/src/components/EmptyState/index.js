import React from 'react';
import PropTypes from 'prop-types';

import './empty-state.css';

const EmptyState = ({children, iconName}) => (
    <div className="mdm-empty-state">
        <div className="icon">
            <i className="material-icons md-64">{iconName}</i>
        </div>
        <div className="message">
            {children}
        </div>
    </div>
);

EmptyState.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element),
    ]).isRequired,
    iconName: PropTypes.string.isRequired,
};
EmptyState.defaultProps = {};

export default EmptyState;
