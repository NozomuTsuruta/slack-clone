import React, { useState, useEffect } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import firebase from '../../firebase';
import {
  setCurrentChannel,
  setPrivateChannel,
} from '../../ducks/channel/actions';
import { useDispatch } from 'react-redux';

const DirectMessages = () => {
  const [users, setUsers] = useState([]);
  const [usersRef] = useState(firebase.firestore().collection('users'));
  const [uid] = useState(firebase.auth().currentUser.uid);
  const [activeChannel,setActiveChannel]=useState('')

  const dispatch = useDispatch();

  useEffect(() => {
    usersRef.onSnapshot((snapshot) => {
      const userArray = snapshot.docs.map((doc) => {
        return { ...doc.data() };
      });
      const _userArray = userArray.filter((user) => user.id !== uid);
      setUsers(_userArray);
    });
  }, []);

  const changeChannel = (user) => {
    const channelId = getChannelId(user.id);
    const channelData = {
      name: user.name,
      id: channelId,
    };
    dispatch(setCurrentChannel(channelData));
    dispatch(setPrivateChannel(true));
    setActiveChannel(user.id)
  };

  const getChannelId = (userId) => {
    const currentUserId = uid;
    return userId < currentUserId
      ? `${userId}${currentUserId}`
      : `${currentUserId}${userId}`;
  };

  return (
    <Menu.Menu className='menu'>
      <Menu.Item>
        <span>
          <Icon name='mail' /> DIRECT MESSAGES
        </span>{' '}
        ({users && users.length})
      </Menu.Item>
      {users &&
        users.map((user) => (
          <Menu.Item
            active={user.id===activeChannel}
            key={user.id}
            onClick={() => changeChannel(user)}
            style={{ opacity: 0.7, fontStyle: 'italic' }}
          >
            <Icon name='circle' color='grey' />@ {user.name}
          </Menu.Item>
        ))}
      {/* users to Send Direct Messages */}
    </Menu.Menu>
  );
};

export default DirectMessages;
