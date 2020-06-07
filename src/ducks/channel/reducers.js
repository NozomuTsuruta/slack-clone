import {ActionTypes} from './constant'

const initialState = {
  currentChannel: null
}

export const channelReducer = (state=initialState,action)=>{
  switch (action.type) {
    case ActionTypes.SET_CURRENT_CHANNEL:
      return {...state,currentChannel: action.payload.currentChannel}
    default:
      return state
  }
}