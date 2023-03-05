import React from 'react';
import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  RefreshControl,
} from 'react-native';
import { useInfiniteQuery, useTheme } from '@/hooks';
import { Spacer, Wrapper } from '@/components';
import { Avatar, FAB, Image, ListItem } from '@rneui/base';
import { Chat } from 'types/chat';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { Nav } from 'types/navigation';
import { chatApi } from '@/services/modules/chat';
import { SheetManager } from 'react-native-actions-sheet';

const Screen = () => {
  const { Fonts, Colors, Images, Layout, Gutters, Common } = useTheme();

  const navigate = useNavigation<Nav>();

  const res = useInfiniteQuery(chatApi.endpoints.getChats);

  const onShowSheet = async () => {
    const data: Chat = await SheetManager.show('createChat');
    res.refetch();
    if (!data) return;
    navigate.navigate('Chat', { chatId: data.id, name: data.subject });
  };

  const renderItem: ListRenderItem<Chat> = ({ item }) => {
    return (
      <ListItem
        onPress={() => {
          navigate.navigate('Chat', { chatId: item.id, name: item.subject });
        }}
        bottomDivider
        containerStyle={[Common.backgroundReset]}
      >
        <Avatar source={{ uri: 'https://picsum.photos/200' }} rounded />
        <ListItem.Content>
          <ListItem.Title style={[Fonts.textRegular]} numberOfLines={1}>
            {item.subject}
          </ListItem.Title>
          <ListItem.Subtitle
            style={[
              Fonts.textSmall,
              {
                fontSize: 12,
              },
            ]}
            numberOfLines={1}
          >
            {moment(item.date).format('DD MMM YY')}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    <Wrapper scrollable={false}>
      <FlatList
        data={res.data}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={res.isLoading} onRefresh={res.refetch} />
        }
        ListEmptyComponent={() => {
          if (res.isLoading) return null;
          return (
            <View style={[Layout.colCenter, Gutters.smallHPadding]}>
              <Spacer size={90} />
              <Image source={Images.chat} style={{ height: 300, width: 300 }} />
              <Text style={[Fonts.textLarge, Fonts.textCenter]}>
                You have not started a conversation yet.
              </Text>
            </View>
          );
        }}
        onEndReached={res.fetchNextPage}
        onEndReachedThreshold={0.5}
      />

      <FAB
        onPress={() => {
          onShowSheet();
        }}
        placement="right"
        icon={{
          name: 'chat-plus',
          type: 'material-community',
          color: Colors.light,
        }}
        color={Colors.primary}
      />
    </Wrapper>
  );
};

export default Screen;
