import React from 'react';
import { Segment, Header, Icon, Input } from 'semantic-ui-react';

const MessagesHeader = (props) => {
  return (
    <Segment clearing>
      <Header fluid='true' as='h2' floated='left' style={{ marginBottom: 0 }}>
        <span>
          {props.channelName}
          <Icon name={'star outline'} color='black' />
        </span>
        <Header.Subheader>{props.numUniqueUsers}</Header.Subheader>
      </Header>
      <Header dloared='right'>
        <Input
          loading={props.searchLoading}
          onChange={props.handleSearchChange}
          size='mini'
          icon='search'
          name='searchTerm'
          placeholder='Search Messages'
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
