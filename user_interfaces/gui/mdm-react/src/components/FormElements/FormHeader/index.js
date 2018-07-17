import React from 'react';
import PropTypes from 'prop-types';

import './form-header.css';

const FormHeader = ({title}) => (
    <div className="mdm-form-header">
        <h2>{title}</h2>
    </div>
);

FormHeader.propTypes = {
    title: PropTypes.string.isRequired,
};
FormHeader.defaultProps = {};

export default FormHeader;
