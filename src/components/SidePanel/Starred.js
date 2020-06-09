import React,{useState} from 'react'
import {Menu,Icon} from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import {setCurrentChannel,setPrivateChannel} from '../../ducks/channel/actions'

const Starred = () => {
  const [activeChannel, setActiveChannel]=useState('')
  const [starredChannels,setStarredChannels]=useState([])
  const dispatch=useDispatch()
  


  const changeChannel = (channel) => {
    setActiveChannel(channel.id);
    dispatch(setCurrentChannel(channel));
    dispatch(setPrivateChannel(false))
  };

  const displayChannels = () =>
  starredChannels.length > 0 &&
    starredChannels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));

  return (
    <Menu.Menu style={{ paddingBottom: '2em' }}>
        <Menu.Item>
          <span>
            <Icon name='star' /> STARRED
          </span>{' '}
          ({starredChannels && starredChannels.length})
        </Menu.Item>
        {displayChannels()}
      </Menu.Menu>
  )
}

export default Starred
