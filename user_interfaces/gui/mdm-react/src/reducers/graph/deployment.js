import _ from 'lodash';

import * as actionTypes from '../../actions';
import * as deploymentActionTypes from '../../actions/graph/deployment';

const initialState = {
  dataGathered: false,
  deployed: false,
  deploying: false,
  gatheringData: false,
  stopping: false,
  error: null,
  dashboardLink: null,
};

const deployment = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case actionTypes.ACTIVE_SYSTEM_RECEIVED: {
      const isDeployed = _.get(action, 'payload.isDeployed', false);
      const isUp = _.get(action, 'payload.isUp', false);

      if (isDeployed && isUp) {
        return {
          ...state,
          dataGathered: true,
          deployed: true,
          error: null,
        };
      }
      if (!isDeployed && isUp) {
        return {
          ...state,
          dataGathered: true,
          gatheringData: false,
          error: null,
        };
      }
      return {
        ...state,
      };
    }

    case deploymentActionTypes.START_GATHERING_DATA: {
      return {
        ...state,
        gatheringData: true,
        error: null,
      };
    }
    case deploymentActionTypes.SYSTEM_DATA_COLLECTED: {
      return {
        ...state,
        dataGathered: true,
        gatheringData: false,
      };
    }
    case deploymentActionTypes.SYSTEM_DATA_COLLECTION_ERROR: {
      const { payload: { error } } = action;

      return {
        ...state,
        dataGathered: false,
        gatheringData: false,
        error,
      };
    }
    case deploymentActionTypes.START_DEPLOYING: {
      return {
        ...state,
        deploying: true,
        error: null,
      };
    }
    case deploymentActionTypes.SYSTEM_DEPLOYMENT_SUCCESS: {
      const dashboardLink = _.get(action, 'payload.body.dashboard_link', null);

      return {
        ...state,
        deployed: true,
        deploying: false,
        dashboardLink,
      };
    }
    case deploymentActionTypes.SYSTEM_DEPLOYMENT_ERROR: {
      const { payload: { error } } = action;

      return {
        ...state,
        dataGathered: false,
        gatheringData: false,
        error,
      };
    }
    case deploymentActionTypes.BACK_TO_MODELLING: {
      return {
        ...state,
        dataGathered: false,
        deployed: false,
        deploying: false,
        gatheringData: false,
      };
    }
    case deploymentActionTypes.INITIALIZE_SYSTEM_STOP: {
      return {
        ...state,
        stopping: true,
      };
    }
    case deploymentActionTypes.SYSTEM_STOPPED: {
      return {
        ...state,
        dataGathered: false,
        deployed: false,
        deploying: false,
        gatheringData: false,
        stopping: false,
        error: null,
      };
    }
    default:
      return state;
  }
};

export default deployment;
