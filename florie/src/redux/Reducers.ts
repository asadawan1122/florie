import {GET_DASHBOARD_DATA} from './Actions';
const initialState = {
  dashboardData: [],
};
function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case GET_DASHBOARD_DATA:
      return {...state, dashboardData: action.payload};
    default:
      return state;
  }
}
export default dashboardReducer;