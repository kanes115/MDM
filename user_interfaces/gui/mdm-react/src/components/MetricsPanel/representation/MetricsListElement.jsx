import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';

import '../../AppDetails/representation/Content/details-list-element.css';

const MetricsListElement = ({
  children,
  isExpanded,
  title,
  toggleExpanded,
  warning,
}) => (
  <li>
    <div className="mdm-details-element">
      <div className={c('title', { warning })}>
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
  warning: PropTypes.bool,
};
MetricsListElement.defaultProps = {
  isExpanded: false,
  warning: false,
};

export default MetricsListElement;
