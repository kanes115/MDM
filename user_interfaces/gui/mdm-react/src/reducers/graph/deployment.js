import * as deploymentActionTypes from '../../actions/graph/deployment';

const initialState = {
  dataGathered: false,
  deployed: false,
  deploying: false,
  gatheringData: false,
  error: null,
};

const deployment = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
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
      return {
        ...state,
        deployed: true,
        deploying: false,
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
    default:
      return state;
  }
};

export default deployment;
