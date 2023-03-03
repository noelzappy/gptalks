import React from 'react';
import { View, Text, FlatList, ListRenderItem } from 'react-native';

import { useTheme } from '@/hooks';
import { Wrapper } from '@/components';
import { Avatar, ListItem } from '@rneui/base';
import { Chat } from 'types/chat';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { Nav } from 'types/navigation';

const Screen = () => {
  const { Fonts } = useTheme();

  const navigate = useNavigation<Nav>();

  const renderItem: ListRenderItem<Chat> = ({ item }) => {
    return (
      <ListItem
        onPress={() => {
          navigate.navigate('Chat', { id: item.id });
        }}
      >
        <Avatar source={{ uri: 'https://picsum.photos/200' }} rounded />
        <ListItem.Content>
          <ListItem.Title style={[Fonts.textRegular]} numberOfLines={1}>
            {item.subject}
          </ListItem.Title>
          <ListItem.Subtitle style={[Fonts.textSmall]} numberOfLines={1}>
            {item.user}
          </ListItem.Subtitle>
        </ListItem.Content>

        <View>
          <Text numberOfLines={1} style={[Fonts.textSmall]}>
            {moment().format('DD MMM YY')}
          </Text>
        </View>
      </ListItem>
    );
  };

  return (
    <Wrapper scrollable={false}>
      <FlatList
        data={[
          {
            id: '3',
            subject: 'John Doe',
            parentMessageId: '1',
            user: 'John Doe',
          },

          {
            id: '23',
            subject: 'John Doe',
            parentMessageId: '1',
            user: 'John Doe',
          },

          {
            id: '4',
            subject: 'John Doe',
            parentMessageId: '1',
            user: 'John Doe',
          },

          {
            id: '234',
            subject: 'John Doe',
            parentMessageId: '1',
            user: 'John Doe',
          },
        ]}
        renderItem={renderItem}
      />
    </Wrapper>
  );
};

export default Screen;
