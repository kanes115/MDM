import React from 'react';
import PropTypes from 'prop-types';

import { CloseIcon } from '../../..';
import CancelButton from './CancelButton';
import ConfigurationButton from './ConfigurationButton';
import CreationButtons from './CreationButtons';
import DeploymentButton from './DeploymentButton';
import MetricsButtons from './MetricsButtons';
import StopButton from './StopButton';
import ClearModelButton from './ClearModelButton';
import DownloadButton from './DownloadButton';

import './creation-panel.css';

const CreationPanel = ({
  deactivate,
  handleConnectionCreation,
  handleMachineCreation,
  handleServiceCreation,
  handleSystemConfiguration,
  handleSystemCreation,
  handleSystemDataCollection,
  handleSystemDeployment,
  isSystemActive,
  modelling,
}) => (
  <div className="panel">
    <CloseIcon onClose={deactivate} />
    <ul>
      <StopButton />
      <DeploymentButton
        handleSystemDataCollection={handleSystemDataCollection}
        handleSystemDeployment={handleSystemDeployment}
        isSystemActive={isSystemActive}
      />
      <ConfigurationButton
        handleSystemConfiguration={handleSystemConfiguration}
        handleSystemCreation={handleSystemCreation}
        isSystemActive={isSystemActive}
        modelling={modelling}
      />
      <ClearModelButton
        isSystemActive={isSystemActive}
      />
      <DownloadButton
        isSystemActive={isSystemActive}
      />
    </ul>
    <CreationButtons
      handleConnectionCreation={handleConnectionCreation}
      handleMachineCreation={handleMachineCreation}
      handleServiceCreation={handleServiceCreation}
      isSystemActive={isSystemActive}
      modelling={modelling}
    />
    <MetricsButtons />
    <ul>
      <CancelButton />
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
  handleSystemDeployment: PropTypes.func.isRequired,
  isSystemActive: PropTypes.bool.isRequired,
  modelling: PropTypes.bool.isRequired,
};
CreationPanel.defaultProps = {};

export default CreationPanel;
