import React from 'react';
import PropTypes from 'prop-types';

import './form-section.css';

const FormSection = ({children, title}) => (
    <div className="mdm-form-section">
        <h3 className="title">{title}</h3>
        <div className="content">
            {children}
        </div>
    </div>

);

FormSection.propTypes = {
    title: PropTypes.string.isRequired,
};
FormSection.defaultProps = {};

export default FormSection;
