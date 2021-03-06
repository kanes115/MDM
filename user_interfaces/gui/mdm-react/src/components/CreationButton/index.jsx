import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { openForm } from '../../actions';
import { startDeploying, startGatheringData } from '../../actions/graph/deployment';

import CreationButton from './representation/index';


class CreationButtonWrapper extends Component {
    state = {
        active: false,
    };

    togglePanel = () => {
        this.setState(prevState => ({
            active: !prevState.active,
        }));
    };

    handleConnectionCreation = () => {
        this.props.openCreationForm('connection');
    };

    handleMachineCreation = () => {
        this.props.openCreationForm('machine');
    };

    handleServiceCreation = () => {
        this.props.openCreationForm('service');
    };

    handleSystemConfiguration = () => {
        this.props.openCreationForm('systemConfig');
    };

    handleSystemCreation = () => {
        this.props.openCreationForm('system');
    };

    handleSystemDataCollection = () => {
        const { activeSystem, activeSystemId, gatherData } = this.props;

        gatherData(activeSystem, activeSystemId);
    };

    handleSystemDeployment = () => {
        const { deploy } = this.props;

        deploy();
    };

    render() {
      const { active } = this.state;
      const { formOpen, isSystemActive, modelling, panelOpen } = this.props;

      return (
        <CreationButton
          active={active}
          formOpen={formOpen}
          handleConnectionCreation={this.handleConnectionCreation}
          handleMachineCreation={this.handleMachineCreation}
          handleServiceCreation={this.handleServiceCreation}
          handleSystemConfiguration={this.handleSystemConfiguration}
          handleSystemCreation={this.handleSystemCreation}
          handleSystemDataCollection={this.handleSystemDataCollection}
          handleSystemDeployment={this.handleSystemDeployment}
          isSystemActive={isSystemActive}
          modelling={modelling}
          panelOpen={panelOpen}
          togglePanel={this.togglePanel}
        />
      );
    }
}

function mapStateToProps({
 graph: {
   deployment: {
     dataGathered,
     deployed,
     deploying,
     gatheringData,
   },
 },
 jmmsr: {
   activeSystemId,
   form: { formOpen },
   metricsPanel: { panelOpen },
   systems,
 }
}) {
  const activeSystem = systems[activeSystemId];
  const isSystemActive = activeSystemId.length > 0;
  const modelling = isSystemActive && !(dataGathered || deployed || deploying || gatheringData);

  return {
    activeSystem,
    activeSystemId,
    formOpen,
    isSystemActive,
    modelling,
    panelOpen,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deploy: () => dispatch(startDeploying()),
    gatherData: (activeSystem, systemName) => dispatch(startGatheringData(activeSystem, systemName)),
    openCreationForm: formType => dispatch(openForm(formType)),
  };
}

CreationButtonWrapper.propTypes = {
  activeSystem: PropTypes.shape({}),
  activeSystemId: PropTypes.string.isRequired,
  deploy: PropTypes.func.isRequired,
  formOpen: PropTypes.bool.isRequired,
  gatherData: PropTypes.func.isRequired,
  isSystemActive: PropTypes.bool.isRequired,
  modelling: PropTypes.bool.isRequired,
  openCreationForm: PropTypes.func.isRequired,
  panelOpen: PropTypes.bool.isRequired,
};
CreationButtonWrapper.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CreationButtonWrapper);
