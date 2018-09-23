import React from 'react';
import PropTypes from 'prop-types';

import './link.css';

const MDMLink = ({ label }) => (
  <span className="mdm-link">
    {label}
  </span>
);

MDMLink.propTypes = {
  label: PropTypes.string.isRequired,
};
MDMLink.defaultProps = {};

export default MDMLink;
