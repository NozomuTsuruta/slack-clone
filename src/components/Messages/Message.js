import React from 'react';
import { useSelector } from 'react-redux';
import { Comment, Image } from 'semantic-ui-react';
import moment from 'moment';

const Message = (props) => {
  const user = useSelector((state) => state.user);

  const isOwnMessage = () => {
    return props.message.user.id === user.currentUser.uid
      ? 'message__self'
      : '';
  };

  const isImage = () => props.message.content===''

  const timeFromNow = () => moment(props.timestamp).fromNow();

  return (
    <Comment>
      <Comment.Avatar src={props.message.user.avatar} />
      <Comment.Content className={isOwnMessage()}>
        <Comment.Author as='a'>{props.message.user.name}</Comment.Author>
        <Comment.Metadata>{timeFromNow()}</Comment.Metadata>
        {isImage() ? (
          <Image src={props.message.image} className='message__image' />
        ) : (
          <Comment.Text>{props.message.content}</Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  );
};

export default Message;
