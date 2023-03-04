import React from 'react';
import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  RefreshControl,
} from 'react-native';
import { useInfiniteQuery, useTheme } from '@/hooks';
import { Wrapper, Spacer, PostItem } from '@/components';
import { postApi } from '@/services/modules/posts';
import { Post } from 'types/post';
import { useNavigation } from '@react-navigation/core';
import { Nav } from 'types/navigation';

const Screen = () => {
  const { Fonts, Gutters, Layout } = useTheme();

  const navigate = useNavigation<Nav>();

  const res = useInfiniteQuery(postApi.endpoints.getPosts);

  const renderItem: ListRenderItem<Post> = ({ item }) => {
    return (
      <PostItem
        item={item}
        onPress={() => navigate.navigate('Post', { post: item })}
      />
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
