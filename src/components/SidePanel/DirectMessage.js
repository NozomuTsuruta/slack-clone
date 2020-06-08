import React, { useState, useEffect } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import firebase from '../../firebase';

const DirectMessages = () => {
  const [users, setUsers] = useState([]);
  const [usersRef] = useState(firebase.firestore().collection('users'));

  useEffect(() => {
      usersRef.onSnapshot((snapshot) => {
        const userArray = snapshot.docs.map((doc) => {
          return { ...doc.data() };
        });
        setUsers(userArray);
      });
  }, []);

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
            key={user.avatar}
            onClick={() => console.log(user)}
            style={{ opacity: 0.7, fontStyle: 'italic' }}
          >
            <Icon name='circle' color='green' />@ {user.name}
          </Menu.Item>
        ))}
      {/* users to Send Direct Messages */}
    </Menu.Menu>
  );
};

export default DirectMessages;
