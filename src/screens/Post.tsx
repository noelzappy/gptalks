import React from 'react';
import { View, Text, FlatList, ListRenderItem } from 'react-native';
import { useTheme } from '@/hooks';
import { Wrapper, PostItem } from '@/components';
import { AllScreenProps } from 'types/navigation';
import { Post } from 'types/post';

const Screen = ({ route, navigation }: AllScreenProps) => {
  const { Fonts, Gutters, Layout } = useTheme();

  const { post } = route.params;

  const renderItem: ListRenderItem<Post> = ({ item }) => {
    return (
      <PostItem
        item={item}
        onPress={() => navigation.navigate('Post', { post: item })}
      />
    );
  };

  return (
    <Wrapper scrollable={false}>
      <FlatList
        ListHeaderComponent={() => {
          return <PostItem item={post} onPress={() => {}} />;
        }}
      />
    </Wrapper>
  );
};

export default Screen;
