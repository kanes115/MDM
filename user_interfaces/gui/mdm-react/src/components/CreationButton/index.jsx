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

    toggleCreationPanel = () => {
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
        const { activeSystem, gatherData } = this.props;

        gatherData(activeSystem);
    };

    handleSystemDeployment = () => {
        const { deploy } = this.props;

        deploy();
    };

    render() {
      const { active } = this.state;
      const { formOpen, isSystemActive, modelling } = this.props;

      return (
        <CreationButton
          active={active}
          formActive={formOpen}
          handleConnectionCreation={this.handleConnectionCreation}
          handleMachineCreation={this.handleMachineCreation}
          handleServiceCreation={this.handleServiceCreation}
          handleSystemConfiguration={this.handleSystemConfiguration}
          handleSystemCreation={this.handleSystemCreation}
          handleSystemDataCollection={this.handleSystemDataCollection}
          handleSystemDeployment={this.handleSystemDeployment}
          isSystemActive={isSystemActive}
          modelling={modelling}
          toggleCreation={this.toggleCreationPanel}
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
 jmmsr: { activeSystemId, form: { formOpen }, systems }
}) {
  const activeSystem = systems[activeSystemId];
  const isSystemActive = activeSystemId.length > 0;
  const modelling = isSystemActive && !(dataGathered || deployed || deploying || gatheringData);

  return {
    activeSystem,
    formOpen,
    isSystemActive,
    modelling,
  };
}

function mapDispatchToProps(dispatch) {
    return {
        deploy: () => dispatch(startDeploying()),
        gatherData: activeSystem => dispatch(startGatheringData(activeSystem)),
        openCreationForm: formType => dispatch(openForm(formType)),
    };
}

CreationButtonWrapper.propTypes = {
  activeSystem: PropTypes.shape({}),
  deploy: PropTypes.func.isRequired,
  formOpen: PropTypes.bool.isRequired,
  gatherData: PropTypes.func.isRequired,
  isSystemActive: PropTypes.bool.isRequired,
  modelling: PropTypes.bool.isRequired,
  openCreationForm: PropTypes.func.isRequired,
};
CreationButtonWrapper.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CreationButtonWrapper);
