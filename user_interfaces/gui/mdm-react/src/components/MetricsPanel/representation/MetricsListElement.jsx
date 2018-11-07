import React from 'react';
import PropTypes from 'prop-types';

import '../../AppDetails/representation/Content/details-list-element.css';

const MetricsListElement = ({
  children,
  isExpanded,
  title,
  toggleExpanded,
}) => (
  <li>
    <div className="mdm-details-element">
      <div className="title">
        <div className="element-indicator" />
        {title}
      </div>
      <div className="options">
        <button
          className="mdm-details-element-option"
          type="button"
          onClick={toggleExpanded}
        >
          {isExpanded
            ? (<i className="material-icons">expand_less</i>)
            : (<i className="material-icons">expand_more</i>)
          }
        </button>
      </div>
    </div>
    {isExpanded && children}
  </li>
);

MetricsListElement.propTypes = {
  children: PropTypes.node.isRequired,
  isExpanded: PropTypes.bool,
  title: PropTypes.string.isRequired,
  toggleExpanded: PropTypes.func.isRequired,
};
MetricsListElement.defaultProps = {
  isExpanded: false,
};

export default MetricsListElement;
