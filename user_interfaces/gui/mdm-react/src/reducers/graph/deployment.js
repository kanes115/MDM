import * as deploymentActionTypes from '../../actions/graph/deployment';

const initialState = {
  dataGathered: false,
  deployed: false,
  deploying: false,
  gatheringData: false,
};

const deployment = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case deploymentActionTypes.START_GATHERING_DATA: {
      return {
        ...state,
        gatheringData: true,
      };
    }
    case deploymentActionTypes.SYSTEM_DATA_COLLECTED: {
      return {
        ...state,
        dataGathered: true,
        gatheringData: false,
      };
    }
    case deploymentActionTypes.START_DEPLOYING: {
      return {
        ...state,
        deploying: true,
      };
    }
    case deploymentActionTypes.SYSTEM_DEPLOYMENT_SUCCESS: {
      return {
        ...state,
        deployed: true,
      };
    }
    default:
      return state;
  }
};

export default deployment;
