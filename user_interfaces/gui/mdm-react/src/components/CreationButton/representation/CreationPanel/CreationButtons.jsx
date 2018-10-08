import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';

const CreationButtons = ({
  handleConnectionCreation,
  handleMachineCreation,
  handleServiceCreation,
  modelling,
}) => (modelling && (
  <ul>
    <li
      onClick={handleMachineCreation}
      className={c({disabled: !modelling})}
    >
      <i className="material-icons">dns</i>
      {' '}
      Add machine
    </li>
    <li
      onClick={handleServiceCreation}
      className={c({disabled: !modelling})}
    >
      <i className="material-icons">category</i>
      {' '}
      Add service
    </li>
    <li
      onClick={handleConnectionCreation}
      className={c({disabled: !modelling})}
    >
      <i className="material-icons">swap_horiz</i>
      {' '}
      Add connection
    </li>
  </ul>
));

CreationButtons.propTypes = {
  handleConnectionCreation: PropTypes.func.isRequired,
  handleMachineCreation: PropTypes.func.isRequired,
  handleServiceCreation: PropTypes.func.isRequired,
  modelling: PropTypes.bool.isRequired,
};
CreationButtons.defaultProps = {};

export default CreationButtons;
