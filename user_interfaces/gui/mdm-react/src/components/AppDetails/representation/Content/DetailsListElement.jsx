import React from 'react';
import PropTypes from 'prop-types';

const DetailsListElement = ({
  children,
  isExpanded,
  title,
  toggleExpanded,
}) => (
  <li>
    <div onClick={toggleExpanded}>
      {title}
    </div>
    {isExpanded && children}
  </li>
);

DetailsListElement.propTypes = {
  children: PropTypes.node.isRequired,
  isExpanded: PropTypes.bool,
  title: PropTypes.string.isRequired,
  toggleExpanded: PropTypes.func.isRequired,
};
DetailsListElement.defaultProps = {
  isExpanded: false,
};

export default DetailsListElement;
