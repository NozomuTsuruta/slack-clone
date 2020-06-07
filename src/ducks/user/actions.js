import {ActionTypes} from './constants'

export const setUser = user => {
  return {
    type: ActionTypes.SET_USER,
    payload: {
      currentUser: user
    }
  }
}

export const clearUser = () => {
  return {
    type: ActionTypes.CLEAR_USER,
  }
}