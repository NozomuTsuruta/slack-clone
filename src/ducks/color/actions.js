import { ActionTypes } from './constants';

export const setColors = (primaryColor, secondaryColor) => {
  return {
    type: ActionTypes.SET_COLORS,
    payload: {
      primaryColor,secondaryColor
    }
  }
};
