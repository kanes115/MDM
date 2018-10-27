import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ConnectionForm from './representation/index';
import {
  createNewConnection,
  updateConnection,
} from "../../../../actions";

class ConnectionFormWrapper extends Component {
  constructor(props) {
    super(props);

    this.connectionCreationFormAPI = null;
  }

  setFormAPI = (formAPI) => {
    const { formObject } = this.props;
    this.connectionCreationFormAPI = formAPI;

    if (formObject) {
      this.connectionCreationFormAPI.setValues(formObject);
    }
  };

  onSubmit = () => {
    const { createConnection, updateConnection, formObject } = this.props;
    const {
      values: {
        service_from,
        service_to,
        port,
      },
    } = this.connectionCreationFormAPI.getState();

    if (formObject) {
      updateConnection(
        {
          service_from,
          service_to,
          port,
        },
        formObject,
      )
    } else {
      createConnection({
        service_from,
        service_to,
        port,
      });
    }
  };

  render() {
    const {
      serviceNames,
    } = this.props;

    return (
      <ConnectionForm
        onSubmit={this.onSubmit}
        setFormAPI={this.setFormAPI}
        serviceNames={serviceNames}
      />
    );
  }
}

ConnectionFormWrapper.propTypes = {
  createConnection: PropTypes.func.isRequired,
  formObject: PropTypes.shape({}),
  serviceNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateConnection: PropTypes.func.isRequired,
};
ConnectionFormWrapper.defaultProps = {};

function mapStateToProps({
  jmmsr: {
   systems,
   activeSystemId,
    form: {
     formObject,
    },
  },
}) {
  const activeSystem = systems[activeSystemId];
  const serviceNames = activeSystem.services.map(service => service.name);

  return {
    formObject,
    serviceNames,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createConnection: (connection) => dispatch(createNewConnection(connection)),
    updateConnection: (newConnection, oldConnection) => dispatch(updateConnection(newConnection, oldConnection)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionFormWrapper);
