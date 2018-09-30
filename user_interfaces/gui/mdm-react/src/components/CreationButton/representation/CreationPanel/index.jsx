import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';

import { CloseIcon } from '../../../index';

import './creation-panel.css';

const CreationPanel = ({
  deactivate,
  handleConnectionCreation,
  handleMachineCreation,
  handleServiceCreation,
  handleSystemConfiguration,
  handleSystemCreation,
  handleSystemDataCollection,
  isSystemActive,
}) => (
  <div className="panel">
    <CloseIcon onClose={deactivate} />
    <ul>
      {isSystemActive && (
      <li onClick={handleSystemDataCollection}>
        <i className="material-icons">publish</i>
        {' '}
Deploy system
      </li>
      )}
      {isSystemActive
        ? (
          <li onClick={handleSystemConfiguration}>
            <i className="material-icons">build</i>
            {' '}
Configure system
          </li>
        )
        : (
          <li onClick={handleSystemCreation}>
            <i className="material-icons">device_hub</i>
            {' '}
Add system
          </li>
        )
            }
    </ul>
    <ul>
      <li
        onClick={isSystemActive ? handleMachineCreation : null}
        className={c({ disabled: !isSystemActive })}
      >
        <i className="material-icons">dns</i>
        {' '}
Add machine
      </li>
      <li
        onClick={isSystemActive ? handleServiceCreation : null}
        className={c({ disabled: !isSystemActive })}
      >
        <i className="material-icons">category</i>
        {' '}
Add service
      </li>
      <li
        onClick={isSystemActive ? handleConnectionCreation : null}
        className={c({ disabled: !isSystemActive })}
      >
        <i className="material-icons">swap_horiz</i>
        {' '}
Add connection
      </li>
    </ul>
  </div>
);

CreationPanel.propTypes = {
  deactivate: PropTypes.func.isRequired,
  handleConnectionCreation: PropTypes.func.isRequired,
  handleMachineCreation: PropTypes.func.isRequired,
  handleServiceCreation: PropTypes.func.isRequired,
  handleSystemConfiguration: PropTypes.func.isRequired,
  handleSystemCreation: PropTypes.func.isRequired,
  handleSystemDataCollection: PropTypes.func.isRequired,
  isSystemActive: PropTypes.bool.isRequired,
};
CreationPanel.defaultProps = {};

export default CreationPanel;
