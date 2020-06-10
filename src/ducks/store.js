import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { userReducer } from './user/reducers';
import { channelReducer } from './channel/reducers';
import { colorReducer } from './color/reducers';

const rootReducers = combineReducers({
  user: userReducer,
  channel: channelReducer,
  color: colorReducer,
});

export const store = createStore(rootReducers, composeWithDevTools());
