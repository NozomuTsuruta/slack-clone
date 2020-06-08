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
  const [numUniqueUsers, setNumUniqueUsers] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
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
          countUniqueUsers(loadedMessages);
          return () => {
            messagesRef.off();
          };
        });
    }
  }, [channel]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSearchLoading(true);
    handleSearchMessages(e.target.value);
  };

  const handleSearchMessages = (searchTerm) => {
    const channelMessages = [...messages];
    const regex = new RegExp(searchTerm, 'gi');
    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    setSearchResults(searchResults);
    setTimeout(() => {
      setSearchLoading(false);
    }, 1000);
  };

  const countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`;
    setNumUniqueUsers(numUsers);
  };

  const displayMessages = (messages) =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message key={message.timestamp} message={message} />
    ));

  const isProgressBarVisible = (percent) => {
    if (percent > 0) {
      setProgressBar(true);
    }
  };

  const displayChannelName = () =>
    channel.currentChannel ? `${channel.currentChannel.name}` : '';

  return (
    <React.Fragment>
      <MessageHeader
        channelName={displayChannelName()}
        numUniqueUsers={numUniqueUsers}
        handleSearchChange={handleSearchChange}
        searchLoading={searchLoading}
      />

      <Segment>
        <CommentGroup
          className={progressBar ? 'messages' : 'messages__progress'}
        >
          {searchTerm
            ? displayMessages(searchResults)
            : displayMessages(messages)}
        </CommentGroup>
      </Segment>

      <MessageForm
        messagesRef={messagesRef}
        isProgressBarVisible={isProgressBarVisible}
      />
    </React.Fragment>
  );
};

export default Messages;
