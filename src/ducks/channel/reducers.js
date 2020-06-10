import {ActionTypes} from './constant'

const initialState = {
  currentChannel: null,
  isPrivateChannel: false,
  userPosts: null
}

export const channelReducer = (state=initialState,action)=>{
  switch (action.type) {
    case ActionTypes.SET_CURRENT_CHANNEL:
      return {...state,currentChannel: action.payload.currentChannel}
    case ActionTypes.SET_PRIVATE_CHANNEL:
      return {...state,isPrivateChannel: action.payload.isPrivateChannel}
    case ActionTypes.SET_USER_POSTS:
      return {...state,userPosts: action.payload.userPosts}
    default:
      return state
  }
}