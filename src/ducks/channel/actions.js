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

export const setUserPosts = (userPosts)=>{
  return {
    type: ActionTypes.SET_USER_POSTS,
    payload: {
      userPosts
    }
  }
}