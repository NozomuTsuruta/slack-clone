import { ActionTypes } from './constants';

const initialState = {
  primaryColor: '',
  secondaryColor: '',
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
