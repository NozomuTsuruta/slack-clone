import React, { useState, useEffect } from 'react';
import { Segment, CommentGroup } from 'semantic-ui-react';
import MessageHeader from './MessageHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import firebase from '../../firebase';
import { useSelector } from 'react-redux';

const Messages = () => {
  const [messagesRef] = useState(firebase.firestore().collection('messages'));
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const channel = useSelector((state) => state.channel);
  const user = useSelector((state) => state.user);
  const [progressBar, setProgressBar] = useState(false);

  useEffect(() => {
    console.log(channel.currentChannel);
    if (channel.currentChannel && user.currentUser) {
      messagesRef
        .doc(channel.currentChannel.id)
        .collection('message')
        .orderBy('timestamp', 'asc')
        .onSnapshot((querySnapshot) => {
          const messageArray = querySnapshot.docs.map((doc) => {
            return { ...doc.data() };
          });
          let loadedMessages = [];
          loadedMessages.push(...messageArray);
          setMessages(loadedMessages);
          setMessagesLoading(false);
          console.log(loadedMessages);
          return () => {
            messagesRef.off();
          };
        });
    }
  }, [channel]);

  const displayMessages = () =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message key={message.timestamp} message={message} />
    ));

  const isProgressBarVisible = (percent) => {
    if (percent > 0) {
      setProgressBar(true);
    }
  };

  return (
    <React.Fragment>
      <MessageHeader />

      <Segment>
        <CommentGroup
          className={progressBar ? 'messages' : 'messages__progress'}
        >
          {displayMessages()}
        </CommentGroup>
      </Segment>

      <MessageForm messagesRef={messagesRef} isProgressBarVisible={isProgressBarVisible}/>
    </React.Fragment>
  );
};

export default Messages;
