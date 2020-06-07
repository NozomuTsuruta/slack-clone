import {ActionTypes} from './constant'

export const setCurrentChannel = (channel) => {
  return {
    type: ActionTypes.SET_CURRENT_CHANNEL,
    payload: {
      currentChannel: channel
    }
  }
}