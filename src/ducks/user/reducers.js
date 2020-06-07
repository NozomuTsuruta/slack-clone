import { ActionTypes } from './constants';

const initialState = {
  currentUser: null,
  isLoading: true,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false,
      };
    case ActionTypes.CLEAR_USER:
      return {
        ...initialState,
        isLoading: false,
      };
    default:
      return state;
  }
};
