import React, { useState, useEffect } from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import firebase from 'firebase';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../ducks/channel/actions';

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [modal, setModal] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelDetails, setChannelDetails] = useState('');
  const [channelsRef] = useState(firebase.firestore().collection('channels'));
  const [firstLoad, setFirstLoad] = useState(true);
  const [activeChannel, setActiveChannel] = useState('');

  useEffect(() => {
    channelsRef.onSnapshot((querySnapshot) => {
      const channelArray = querySnapshot.docs.map((doc) => {
        return { ...doc.data() };
      });
      let loadedChannels = [];
      loadedChannels.push(...channelArray);
      setChannels(loadedChannels);
      if (firstLoad && loadedChannels.length > 0) {
        const firstChannel = loadedChannels[0];
        dispatch(setCurrentChannel(firstChannel));
        setActiveChannel(firstChannel.id);
      }
      setFirstLoad(false);
      return () => {
        channelsRef.off();
      };
    });
  }, []);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const channelNameChange = (e) => {
    setChannelName(e.target.value);
  };

  const channelDetailsChange = (e) => {
    setChannelDetails(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      addChannel();
    }
  };

  const addChannel = () => {
    const key = channelsRef.doc().id;
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.currentUser.displayName,
        avatar: user.currentUser.photoURL,
      },
    };

    channelsRef
      .doc(key)
      .set(newChannel)
      .then(() => {
        setChannelName('');
        setChannelDetails('');
        closeModal();
        console.log('channel added');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const changeChannel = (channel) => {
    setActiveChannel(channel.id);
    dispatch(setCurrentChannel(channel));
    dispatch(setPrivateChannel(false))
  };

  const displayChannels = () =>
    channels.length > 0 &&
    channels.map((channel) => (
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

  const isFormValid = () => channelName && channelDetails;

  const openModal = () => setModal(true);

  const closeModal = () => setModal(false);

  return (
    <React.Fragment>
      <Menu.Menu style={{ paddingBottom: '2em' }}>
        <Menu.Item>
          <span>
            <Icon name='exchange' /> CHANNELS
          </span>{' '}
          ({channels && channels.length})<Icon name='add' onClick={openModal} />
        </Menu.Item>
        {displayChannels()}
      </Menu.Menu>

      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input
                fluid
                label='Name of Channnel'
                name='setChannelName'
                value={channelName}
                onChange={channelNameChange}
              />
            </Form.Field>

            <Form.Field>
              <Input
                fluid
                label='About the channel'
                name='setChannelDetails'
                value={channelDetails}
                onChange={channelDetailsChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button color='green' inverted onClick={handleSubmit}>
            <Icon name='checkmark' /> Add
          </Button>
          <Button color='red' inverted onClick={closeModal}>
            <Icon name='remove' /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </React.Fragment>
  );
};

export default Channels;
