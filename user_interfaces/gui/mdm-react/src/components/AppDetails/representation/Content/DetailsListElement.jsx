import React from 'react';
import PropTypes from 'prop-types';

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
    <div>
      {title}
      <button
        type="button"
        onClick={toggleExpanded}
      >
        {isExpanded
          ? (<i className="material-icons">expand_less</i>)
          : (<i className="material-icons">expand_more</i>)
        }
      </button>
      <button
        type="button"
        onClick={onEditClick}
        disabled={!canModify}
      >
        <i className="material-icons">edit</i>
      </button>
      <button
        type="button"
        onClick={onDeleteClick}
        disabled={!canModify}
      >
        <i className="material-icons">delete</i>
      </button>
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
