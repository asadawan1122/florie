import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import dashboardReducer from './reducers/DashboardReducer';
import userReducer from './reducers/UserReducer';
import statReducer from './reducers/StatReducer';
const rootReducer = combineReducers({
  dashboardReducer,
  userReducer,
  statReducer,
});
export const store = createStore(rootReducer, applyMiddleware(thunk));
