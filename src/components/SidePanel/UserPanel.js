import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import { Grid, Header, Icon, Dropdown,Image } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

const UserPanel = () => {
  const userdata = useSelector((state) => state.user);
  const [user, setUser] = useState(userdata);


  useEffect(() => {
    setUser(userdata);
  });

  const dropdownOption = () => [
    {
      key: 'user',
      text: (
        <span>
          Signed in as <strong>{user && user.currentUser.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: 'avatar',
      text: <span>Change Avatar</span>,
    },
    {
      key: 'signout',
      text: <span onClick={handleSignout}>Sign Out</span>,
    },
  ];

  const handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('signed out'));
  };

  return (
    <Grid style={{ background: '#4c3c4c' }}>
      <Grid.Column>
        <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
          {/* AppHeader */}
          <Header inverted floated='left' as='h2'>
            <Icon name='code' />
            <Header.Content>DevChat</Header.Content>
          </Header>
        </Grid.Row>

        {/* User Dropdown */}
        <Header style={{ padding: '0.25em' }} as='h4' inverted>
          <Dropdown
            trigger={<span><Image src={user&&user.currentUser.photoURL} spaced="right" avatar/>{user&&user.currentUser.displayName}</span>}
            options={dropdownOption()}
          />
        </Header>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
