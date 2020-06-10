import React, { useState } from 'react';
import {
  Segment,
  Header,
  Accordion,
  Icon,
  Image,
  List,
} from 'semantic-ui-react';
import { useSelector } from 'react-redux';

const MetaPanel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const channel = useSelector((state) => state.channel);

  const setActiveIndexFunc = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const formatCount = num =>(num>1||num===0?`${num} posts`:`${num} post`)

  const displayTopPosters = () => (
    Object.entries(channel.userPosts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, val], i) => (
        <List.Item key={i}>
          <Image avatar src={val.avatar} />
          <List.Content>
            <List.Header as='a'>{key}</List.Header>
            <List.Description>{formatCount(val.count)}</List.Description>
          </List.Content>
        </List.Item>
      )).slice(0,5)
  );

  if (channel.isPrivateChannel) return null;

  return (
    <Segment loading={!channel.currentChannel}>
      <Header as='h3' attached='top'>
        About {channel.currentChannel && channel.currentChannel.name}
      </Header>
      <Accordion styled attached='true'>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={setActiveIndexFunc}
        >
          <Icon name='dropdown' />
          <Icon name='info' />
          Channel Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          {channel.currentChannel && channel.currentChannel.details}
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={setActiveIndexFunc}
        >
          <Icon name='dropdown' />
          <Icon name='user circle' />
          Top Posters
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <List>{channel.userPosts && displayTopPosters()}</List>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={setActiveIndexFunc}
        >
          <Icon name='dropdown' />
          <Icon name='pencil alternate' />
          Created By
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <Header as='h3'>
            <Image
              circular
              src={
                channel.currentChannel &&
                channel.currentChannel.createdBy.avatar
              }
            />
          </Header>
          {channel.currentChannel && channel.currentChannel.createdBy.name}
        </Accordion.Content>
      </Accordion>
    </Segment>
  );
};

export default MetaPanel;
