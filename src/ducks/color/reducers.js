import { ActionTypes } from './constants';

const initialState = {
  primaryColor: '#4c3c4c',
  secondaryColor: '#eee',
};

export const colorReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_COLORS:
      return {
        ...state,
        primaryColor: action.payload.primaryColor,
        secondaryColor: action.payload.secondaryColor,
      };
    default:
      return state;
  }
};
