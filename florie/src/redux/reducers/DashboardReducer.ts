import {GET_DASHBOARD_DATA, GET_STATS} from '../Actions';
const initialState = {
  data: null,
  projects: [],
};
function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case GET_DASHBOARD_DATA:
      return {...state, data: action.payload};

    case GET_DASHBOARD_DATA:
      return {...state, projects: action.payload};

    case GET_STATS:
      return {...state, data: action.payload};

    default:
      return state;
  }
}
export default dashboardReducer;
