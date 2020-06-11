import React, { useState, useEffect } from 'react';
import { Segment, CommentGroup } from 'semantic-ui-react';
import MessageHeader from './MessageHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import firebase from '../../firebase';
import { useSelector, useDispatch } from 'react-redux';
import { setUserPosts } from '../../ducks/channel/actions';

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
  const [privateMessageRef] = useState(
    firebase.firestore().collection('privateMessages')
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (channel.currentChannel && user.currentUser) {
      const ref = getMessageRef();
      ref
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
          countUserPosts(loadedMessages);
          return () => {
            getMessageRef().off();
          };
        });
    }
  }, [channel.currentChannel]);

  useEffect(() => {
    const scrollArea = document.getElementById('scroll-area');
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

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

  const getMessageRef = () => {
    return channel.isPrivateChannel ? privateMessageRef : messagesRef;
  };

  const countUserPosts = (messages) => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1,
        };
      }
      return acc;
    }, {});
    dispatch(setUserPosts(userPosts));
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

  const displayChannelName = () => {
    return channel.currentChannel
      ? `${channel.isPrivateChannel ? '@' : '#'}${channel.currentChannel.name}`
      : '';
  };

  return (
    <React.Fragment>
      <MessageHeader
        channelName={displayChannelName()}
        numUniqueUsers={numUniqueUsers}
        isPrivateChannel={channel.isPrivateChannel}
        handleSearchChange={handleSearchChange}
        searchLoading={searchLoading}
      />

      <Segment>
        <CommentGroup
          className={progressBar ? 'messages' : 'messages__progress'}
          id='scroll-area'
        >
          {searchTerm
            ? displayMessages(searchResults)
            : displayMessages(messages)}
        </CommentGroup>
      </Segment>

      <MessageForm
        messagesRef={messagesRef}
        isPrivateChannel={channel.isPrivateChannel}
        isProgressBarVisible={isProgressBarVisible}
        getMessageRef={getMessageRef}
      />
    </React.Fragment>
  );
};

export default Messages;
