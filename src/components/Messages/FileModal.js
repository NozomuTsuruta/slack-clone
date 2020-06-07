import React, { useState } from 'react';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';
import mime from 'mime-types';

const FileModal = (props) => {
  const [file, setFile] = useState(null);
  const [authorized] = useState('image/jpeg', 'image/png');

  const addFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const sendFile = () => {
    if (file !== null) {
      if (isAuthorized(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        props.uploadFile(file, metadata);
        props.closeModal();
        clearFile();
      }
    }
  };

  const isAuthorized = (filename) => authorized.includes(mime.lookup(filename));

  const clearFile = () => setFile(null);

  return (
    <Modal basic open={props.modal} onClose={props.closeModal}>
      <Modal.Header>Select an Image File</Modal.Header>
      <Modal.Content>
        <Input
          fluid
          label='File types: jpg, png'
          name='file'
          type='file'
          onChange={addFile}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button color='green' inverted onClick={sendFile}>
          <Icon name='checkmark' /> Send
        </Button>
        <Button color='red' inverted onClick={props.closeModal}>
          <Icon name='remove' /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FileModal;
