import React from 'react';
import PropTypes from 'prop-types';

import './close-icon.css';

const CloseIcon = ({onClose}) => (
    <div className="close-icon"
         onClick={onClose}>
        <i className="material-icons">close</i>
    </div>
);

CloseIcon.propTypes = {
    onClose: PropTypes.func.isRequired,
};
CloseIcon.defaultProps = {};

export default CloseIcon;
