import { GET_STATS} from '../Actions';
const initialState = {
  data: [],
};
function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case GET_STATS:
      return {...state, data: action.payload};

    default:
      return state;
  }
}
export default dashboardReducer;
