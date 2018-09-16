import React from 'react';
import PropTypes from 'prop-types';

import './creation-icon.css';

const PromptIcon = ({ activate }) => (
  <div
    className="prompt"
    onClick={activate}
  >
    <i className="material-icons">add</i>
  </div>
);

PromptIcon.propTypes = {
  activate: PropTypes.func.isRequired,
};
PromptIcon.defaultProps = {};

export default PromptIcon;
