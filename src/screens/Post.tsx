import React, { useState, useEffect } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  RefreshControl,
} from 'react-native';
import { useInfiniteQuery, useTheme } from '@/hooks';
import { Wrapper, ReplyItem, PostHead } from '@/components';
import { AllScreenProps } from 'types/navigation';
import { PostReply } from 'types/post';
import { postApi, useCreatePostReplyMutation } from '@/services/modules/posts';
import { Input, LinearProgress } from '@rneui/base';
import { useToast } from 'react-native-toast-notifications';

const Screen = ({ route, navigation }: AllScreenProps) => {
  const { Fonts, Gutters, Layout, Colors } = useTheme();

  const toast = useToast();

  const [text, setText] = useState('');

  const { post } = route.params;

  const res = useInfiniteQuery(postApi.endpoints.getPostReplies, {
    post: post.id,
    page: 1,
  });

  const [createPostReply, { isLoading, error }] = useCreatePostReplyMutation();

  useEffect(() => {
    if (error) {
      toast.show('We could not publish your reply', {
        type: 'danger',
      });
    }
  }, [error]);

  const onReply = () => {
    createPostReply({
      post: post.id,
      text,
    });
    setText('');
    res.refetch();
  };

  const renderItem: ListRenderItem<PostReply> = ({ item }) => {
    return <ReplyItem item={item} onPress={() => {}} />;
  };

  return (
    <Wrapper scrollable={false}>
      <FlatList
        ListHeaderComponent={() => {
          return <PostHead item={post} onPress={() => {}} />;
        }}
        data={res.data}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={res.isLoading} onRefresh={res.refetch} />
        }
      />
      <KeyboardAvoidingView behavior="padding">
        <Input
          placeholder="Reply to this post"
          onChangeText={setText}
          value={text}
          inputContainerStyle={[
            {
              height: 50,
              backgroundColor: Colors.grayLighter,
              paddingHorizontal: 10,
            },
          ]}
          containerStyle={{
            paddingHorizontal: 0,
          }}
          rightIcon={{
            name: 'send',
            color: Colors.primary,
            onPress: () => {
              if (!text) return;
              onReply();
            },
            type: 'material-community',
          }}
          disabled={isLoading}
        />
        {isLoading && <LinearProgress color={Colors.primary} />}
      </KeyboardAvoidingView>
    </Wrapper>
  );
};

export default Screen;
