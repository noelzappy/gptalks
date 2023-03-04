import React from 'react';
import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  RefreshControl,
} from 'react-native';
import { useInfiniteQuery, useTheme } from '@/hooks';
import { Wrapper, Spacer } from '@/components';
import { postApi } from '@/services/modules/posts';
import { Post } from 'types/post';
import { Avatar, ListItem } from '@rneui/base';

const Screen = () => {
  const { Fonts, Gutters, Layout, Common, Colors } = useTheme();
  const res = useInfiniteQuery(postApi.endpoints.getPosts);

  const renderItem: ListRenderItem<Post> = ({ item }) => {
    return (
      <ListItem
        bottomDivider
        containerStyle={[
          {
            alignItems: 'stretch',
          },
        ]}
      >
        <View>
          <Avatar
            source={{ uri: 'https://picsum.photos/200' }}
            rounded
            size="small"
          />
        </View>

        <ListItem.Content>
          <View
            style={[
              {
                paddingBottom: 3,
              },
            ]}
          >
            <Text style={[Fonts.textSmall]}>{item.description}</Text>
          </View>

          <View style={[Common.viewImage]}>
            <View style={[Common.userBubble]}>
              <Text
                style={[
                  Fonts.textSmall,
                  {
                    fontSize: 12,
                    color: Colors.light,
                  },
                ]}
              >
                {item.prompt.message}
              </Text>
            </View>

            <View style={[Common.botBubble]}>
              <Text
                style={[
                  Fonts.textSmall,
                  {
                    fontSize: 12,
                    color: Colors.dark,
                  },
                ]}
              >
                {item.response.message}
              </Text>
            </View>
          </View>
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

              <Text style={[Fonts.textLarge, Fonts.textCenter]}>
                No one has posted yet. Be the first to post!
              </Text>
            </View>
          );
        }}
        onEndReached={res.fetchNextPage}
        onEndReachedThreshold={0.5}
        contentContainerStyle={[
          {
            paddingHorizontal: 5,
          },
        ]}
      />
    </Wrapper>
  );
};

export default Screen;
