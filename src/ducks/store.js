import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { userReducer } from './user/reducers';
import { channelReducer } from './channel/reducers';

const rootReducers = combineReducers({
  user: userReducer,
  channel: channelReducer,
});

export const store = createStore(rootReducers, composeWithDevTools());
