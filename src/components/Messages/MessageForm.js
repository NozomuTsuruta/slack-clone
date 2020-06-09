import React, { useState } from 'react';
import { Segment, Input, Button } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import firebase from '../../firebase';
import FileModal from './FileModal';
import uuidv4 from 'uuid/v4';
import ProgressBar from './ProgressBar';

const MessageForm = (props) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [modal, setModal] = useState(false);
  const [uploadTask, setUploadTask] = useState(null);
  const [uploadState, setUploadState] = useState('');
  const [percentUploaded, setPercentUploaded] = useState(0);
  const [storageRef] = useState(firebase.storage().ref());
  const channel = useSelector((state) => state.channel);
  const user = useSelector((state) => state.user);

  const openModal = () => setModal(true);

  const closeModal = () => setModal(false);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const createMessage = (fileUrl = null) => {
    const mess = {
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      user: {
        id: user.currentUser.uid,
        name: user.currentUser.displayName,
        avatar: user.currentUser.photoURL,
      },
      content: message,
    };
    if (fileUrl !== null) {
      mess['image'] = fileUrl;
    } else {
      mess['content'] = message;
    }
    return mess;
  };

  const sendMessage = () => {
    if (message) {
      setLoading(true);
      props
        .getMessageRef()
        .doc(channel.currentChannel.id)
        .collection('message')
        .add(createMessage())
        .then(() => {
          setLoading(false);
          setMessage('');
          setErrors([]);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setErrors(errors.concat(err));
        });
    } else {
      setErrors(errors.concat({ message: 'Add a message' }));
    }
  };

  const getPath = () => {
    if (props.isPrivateChannel) {
      return `chat/private-${channel.id}`;
    } else {
      return 'chat/public';
    }
  };

  const uploadFile = async (file, metadata) => {
    if (channel.currentChannel) {
      const pathToUpload = channel.currentChannel.id;
      const ref = props.getMessageRef();
      const filePath = `${getPath()}/${uuidv4()}.jpg`;

      setUploadState('uploading');
      setUploadTask(storageRef.child(filePath).put(file, metadata));
      await storageRef
        .child(filePath)
        .put(file, metadata)
        .then((snapshot) => {
          const percent =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          props.isProgressBarVisible(percent);
          setPercentUploaded(percent);
          firebase
            .storage()
            .ref(filePath)
            .getDownloadURL()
            .then((url) => {
              sendFileMessage(url, ref, pathToUpload);
            });
        })
        .catch((err) => {
          console.error(err);
          setErrors(errors.concat(err));
          setUploadState('error');
          setUploadTask(null);
        });
    }
  };

  const sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .doc(pathToUpload)
      .collection('message')
      .add(createMessage(fileUrl))
      .then(() => {
        setUploadState('done');
      })
      .catch((err) => {
        console.err(err);
        setErrors(errors.concat(err));
      });
  };

  return (
    <Segment className='message__form'>
      <Input
        fluid
        name='message'
        onChange={handleChange}
        value={message}
        style={{ marginButtom: '0.7em' }}
        label={<Button icon={'add'} />}
        labelPosition='left'
        className={
          errors.some((error) => error.message.includes('message'))
            ? 'error'
            : ''
        }
        placeholder='Write your message'
      />
      <Button.Group icon widths='2'>
        <Button
          onClick={sendMessage}
          disabled={loading}
          color='orange'
          content='Reply'
          labelPosition='left'
          icon='edit'
        />
        <Button
          color='teal'
          disabled={uploadState === 'uploading'}
          onClick={openModal}
          content='upload Media'
          labelPosition='right'
          icon='cloud upload'
        />
      </Button.Group>
      <FileModal
        modal={modal}
        closeModal={closeModal}
        uploadFile={uploadFile}
      />
      <ProgressBar
        uploadState={uploadState}
        percentUploaded={percentUploaded}
      />
    </Segment>
  );
};

export default MessageForm;
