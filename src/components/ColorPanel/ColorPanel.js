import React, { useState, useEffect } from 'react';
import {
  Sidebar,
  Menu,
  Divider,
  Button,
  Modal,
  Icon,
  Label,
  Segment,
} from 'semantic-ui-react';
import { SwatchesPicker } from 'react-color';
import firebase from '../../firebase';
import { useSelector, useDispatch } from 'react-redux';
import { setColors } from './../../ducks/color/actions';

const ColorPanel = () => {
  const [modal, setModal] = useState(false);
  const [primary, setPrimary] = useState('');
  const [secondary, setSecondary] = useState('');
  const [usersRef] = useState(firebase.firestore().collection('users'));
  const user = useSelector((state) => state.user);
  const dispatch=useDispatch()

  useEffect(() => {
    if (user.currentUser) {
      usersRef.onSnapshot((snapshot) => {
        const userArray = snapshot.docs.map((doc) => {
          return { ...doc.data() };
        });
        const primaryColor = userArray.filter(
          (el) => el.id === user.currentUser.uid
        )[0].primary;
        setPrimary(primaryColor);
        const secondaryColor = userArray.filter(
          (el) => el.id === user.currentUser.uid
        )[0].secondary;
        setSecondary(secondaryColor);
        dispatch(setColors(primaryColor,secondaryColor))
      });
    }
  }, []);

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const changePrimary = (color) => {
    setPrimary(color.hex);
  };

  const changeSecondary = (color) => {
    setSecondary(color.hex);
  };

  const handleSaveColors = () => {
    if (primary && secondary) {
      usersRef
        .doc(user.currentUser.uid)
        .set(
          {
            avatar: user.currentUser.photoURL,
            id: user.currentUser.uid,
            name: user.currentUser.displayName,
            primary,
            secondary
          },
          { merge: true }
        )
        .then(() => {
          console.log('Colors added');
          closeModal();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <Sidebar
      as={Menu}
      icon='labeled'
      inverted
      vertical
      visible
      width='very thin'
    >
      <Divider />
      <Button icon='pencil' size='small' color='blue' onClick={openModal} />
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Choose App Colors</Modal.Header>
        <Modal.Content>
          <Segment>
            <Label content='Primary Color' />
            <SwatchesPicker color={primary} onChange={changePrimary} />
          </Segment>

          <Segment>
            <Label content='Secondary Color' />
            <SwatchesPicker color={secondary} onChange={changeSecondary} />
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' inverted onClick={handleSaveColors}>
            <Icon name='checkmark' /> Save Colors
          </Button>
          <Button color='red' inverted onClick={closeModal}>
            <Icon name='remove' /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Sidebar>
  );
};

export default ColorPanel;
