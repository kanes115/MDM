import React from 'react';
import PropTypes from 'prop-types';

import './details-list-element.css';

const DetailsListElement = ({
  canModify,
  children,
  isExpanded,
  title,
  onDeleteClick,
  onEditClick,
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
        {
          canModify && (
            <button
              className="mdm-details-element-option"
              type="button"
              onClick={onEditClick}
            >
              <i className="material-icons">edit</i>
            </button>
          )
        }
        {canModify && (
          <button
            className="mdm-details-element-option"
            type="button"
            onClick={onDeleteClick}
          >
            <i className="material-icons">delete</i>
          </button>
        )}
      </div>
    </div>
    {isExpanded && children}
  </li>
);

DetailsListElement.propTypes = {
  canModify: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  isExpanded: PropTypes.bool,
  onDeleteClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  toggleExpanded: PropTypes.func.isRequired,
};
DetailsListElement.defaultProps = {
  isExpanded: false,
};

export default DetailsListElement;
