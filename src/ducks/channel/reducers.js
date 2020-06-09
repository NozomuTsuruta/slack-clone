import {ActionTypes} from './constant'

const initialState = {
  currentChannel: null,
  isPrivateChannel: false
}

export const channelReducer = (state=initialState,action)=>{
  switch (action.type) {
    case ActionTypes.SET_CURRENT_CHANNEL:
      console.log(action)
      return {...state,currentChannel: action.payload.currentChannel}
    case ActionTypes.SET_PRIVATE_CHANNEL:
      return {...state,isPrivateChannel: action.payload.isPrivateChannel}
    default:
      return state
  }
}