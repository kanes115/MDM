import React from 'react';
import PropTypes from 'prop-types';

import CreationIcon from './CreationIcon';
import CreationPanel from './CreationPanel';

import './creation-button.css';

const CreationButton = ({
  active,
  formOpen,
  handleConnectionCreation,
  handleMachineCreation,
  handleServiceCreation,
  handleSystemConfiguration,
  handleSystemCreation,
  handleSystemDataCollection,
  handleSystemDeployment,
  isSystemActive,
  modelling,
  panelOpen,
  togglePanel,
}) => (!formOpen && !panelOpen) && (
  <div className="mdm-creation-button">
    {active
      ? (
        <CreationPanel
          deactivate={togglePanel}
          handleConnectionCreation={handleConnectionCreation}
          handleMachineCreation={handleMachineCreation}
          handleServiceCreation={handleServiceCreation}
          handleSystemConfiguration={handleSystemConfiguration}
          handleSystemCreation={handleSystemCreation}
          handleSystemDataCollection={handleSystemDataCollection}
          handleSystemDeployment={handleSystemDeployment}
          isSystemActive={isSystemActive}
          modelling={modelling}
        />
      )
      : (<CreationIcon activate={togglePanel}/>)
    }
  </div>
);

CreationButton.propTypes = {
  active: PropTypes.bool.isRequired,
  formOpen: PropTypes.bool.isRequired,
  handleConnectionCreation: PropTypes.func.isRequired,
  handleMachineCreation: PropTypes.func.isRequired,
  handleServiceCreation: PropTypes.func.isRequired,
  handleSystemConfiguration: PropTypes.func.isRequired,
  handleSystemCreation: PropTypes.func.isRequired,
  handleSystemDataCollection: PropTypes.func.isRequired,
  handleSystemDeployment: PropTypes.func.isRequired,
  isSystemActive: PropTypes.bool.isRequired,
  modelling: PropTypes.bool.isRequired,
  panelOpen: PropTypes.bool.isRequired,
  togglePanel: PropTypes.func.isRequired,
};
CreationButton.defaultProps = {};

export default CreationButton;
