import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  CreationButton,
  CreationForm,
  EmptyState,
  MetricsPanel,
} from '../../../components/index';

import ModelContent from './ModelContent';

class ModelPage extends Component {
  render() {
    const { isSystemActive, openSystemCreationForm } = this.props;

    return (
      <div className="mdm-model">
        {isSystemActive
          ? (<ModelContent />)
          : (
            <EmptyState iconName="device_hub">
              <div>There is no active system</div>
              <div>
                {'To start modeling'}
                {' '}
                <span
                  className="action"
                  onClick={openSystemCreationForm}
                >
                  {'create new system'}
                </span>
              </div>
            </EmptyState>
          )
                }
        <CreationButton />
        <CreationForm />
        <MetricsPanel />
      </div>
    );
  }
}

ModelPage.propTypes = {
  isSystemActive: PropTypes.bool.isRequired,
  openSystemCreationForm: PropTypes.func.isRequired,
};
ModelPage.defaultProps = {};

export default ModelPage;
