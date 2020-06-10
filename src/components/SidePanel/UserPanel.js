import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button,
} from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import AvatarEditor from 'react-avatar-editor';

const UserPanel = () => {
  const userdata = useSelector((state) => state.user);
  const [user, setUser] = useState(userdata);
  const color = useSelector((state) => state.color);
  const [modal, setModal] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [cropedImage, setCroppedImage] = useState('');
  const [blob, setBlob] = useState('');
  const [storageRef] = useState(firebase.storage().ref());
  const [userRef] = useState(firebase.auth().currentUser);
  const [metadata] = useState({
    contentType: 'image/jpeg',
  });
  const [uploadedCroppedImage, setUploadedCroppedImage] = useState('');
  const [usersRef] = useState(firebase.firestore().collection('users'));

  useEffect(() => {
    setUser(userdata);
  });

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

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
      text: <span onClick={openModal}>Change Avatar</span>,
    },
    {
      key: 'signout',
      text: <span onClick={handleSignout}>Sign Out</span>,
    },
  ];

  const updateCroppedImage = () => {
    storageRef
      .child(`avatars/user-${userRef.uid}`)
      .put(blob, metadata)
      .then((snap) => {
        snap.ref.getDownloadURL().then((downloadURL) => {
          setUploadedCroppedImage(downloadURL);
          userRef
            .updateProfile({
              photoURL: downloadURL,
            })
            .then(() => {
              console.log('photoURL updated');
              usersRef
                .doc(user.currentUser.uid)
                .update({ avatar: uploadedCroppedImage })
                .then(() => {
                  console.log(uploadedCroppedImage);
                })
                .catch((err) => {
                  console.error(err);
                });
              closeModal();
            })
            .catch((err) => {
              console.error(err);
            });
        });
      }).catch((err)=>{
        console.error(err)
      })
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        setPreviewImage(reader.result);
      });
    }
  };

  const handleCropImage = () => {
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob((blob) => {
        let imageUrl = URL.createObjectURL(blob);
        setCroppedImage(imageUrl);
        setBlob(blob);
      });
    }
  };

  const handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('signed out'));
  };

  return (
    <Grid style={{ background: color.primaryColor }}>
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
            trigger={
              <span>
                <Image
                  src={user && user.currentUser.photoURL}
                  spaced='right'
                  avatar
                />
                {user && user.currentUser.displayName}
              </span>
            }
            options={dropdownOption()}
          />
        </Header>
        <Modal basic open={modal} onClose={closeModal}>
          <Modal.Header>Change Avatar</Modal.Header>
          <Modal.Content>
            <Input
              onChange={handleChange}
              fluid
              type='file'
              label='New Avatar'
              name='previewImage'
            />
            <Grid centered stackable columns={2}>
              <Grid.Row centered>
                <Grid.Column className='ui center aligned grid'>
                  {previewImage && (
                    <AvatarEditor
                      ref={(node) => (this.avatarEditor = node)}
                      image={previewImage}
                      width={120}
                      height={120}
                      border={50}
                      scale={1.2}
                    />
                  )}
                </Grid.Column>
                <Grid.Column>
                  {cropedImage && (
                    <Image
                      style={{ margin: '3.5em auto' }}
                      width={100}
                      height={100}
                      src={cropedImage}
                    />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            {cropedImage && (
              <Button color='green' inverted onClick={updateCroppedImage}>
                <Icon name='save' /> Change Avatar
              </Button>
            )}
            <Button color='green' inverted onClick={handleCropImage}>
              <Icon name='image' /> Preview
            </Button>
            <Button color='red' inverted onClick={closeModal}>
              <Icon name='remove' /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
