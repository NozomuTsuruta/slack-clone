import {ActionTypes} from './constant'

export const setCurrentChannel = (channel) => {
  return {
    type: ActionTypes.SET_CURRENT_CHANNEL,
    payload: {
      currentChannel: channel
    }
  }
}

export const setPrivateChannel = (isPrivateChannel) =>{
  return {
    type: ActionTypes.SET_PRIVATE_CHANNEL,
    payload: {
      isPrivateChannel
    }
  }
}